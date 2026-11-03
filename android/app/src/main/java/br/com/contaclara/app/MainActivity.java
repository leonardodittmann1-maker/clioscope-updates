package br.com.contaclara.app;

import android.app.Activity;
import android.os.Bundle;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.ValueCallback;
import android.widget.Toast;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.ByteArrayOutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

public class MainActivity extends Activity {
    private static final String HOME = "https://contaclara.app.local/";
    private static final String REMOTE = "https://raw.githubusercontent.com/leonardodittmann1-maker/clioscope-updates/conta-clara-app/app.html";
    private static final int PICK_FILE = 501;
    private static final int SAVE_FILE = 502;
    private WebView web;
    private ValueCallback<Uri[]> chooserCallback;
    private byte[] pendingExport;
    private String pendingMime;

    public final class ContaClaraBridge {
        @JavascriptInterface public void reloadApp() {
            runOnUiThread(() -> loadApplication());
        }

        @JavascriptInterface public void saveDocument(String filename, String base64, String mime) {
            try {
                byte[] bytes = Base64.decode(base64, Base64.DEFAULT);
                if (bytes.length > 16 * 1024 * 1024)
                    throw new IllegalArgumentException("Arquivo muito grande");
                String safeName = filename.replaceAll("[^\\p{L}\\p{N}._-]", "_");
                if (safeName.length() == 0) safeName = "conta-clara";
                final String name = safeName;
                final String type = mime == null ? "application/octet-stream" : mime.split(";")[0];
                runOnUiThread(() -> {
                    try {
                        pendingExport = bytes;
                        pendingMime = type;
                        Intent save = new Intent(Intent.ACTION_CREATE_DOCUMENT);
                        save.addCategory(Intent.CATEGORY_OPENABLE);
                        save.setType(type);
                        save.putExtra(Intent.EXTRA_TITLE, name);
                        startActivityForResult(save, SAVE_FILE);
                    } catch (Exception e) {
                        pendingExport = null;
                        notifyUser("Não foi possível exportar: " + e.getMessage());
                    }
                });
            } catch (Exception e) {
                runOnUiThread(() -> notifyUser("Falha ao preparar o arquivo: " + e.getMessage()));
            }
        }
    }

    private void notifyUser(String message) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show();
    }

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setStatusBarColor(Color.rgb(245,247,251));
        getWindow().getDecorView().setSystemUiVisibility(android.view.View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
        web = new WebView(this);
        WebSettings settings = web.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(true);
        settings.setDefaultTextEncodingName("UTF-8");
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        web.addJavascriptInterface(new ContaClaraBridge(), "ContaClaraNative");

        web.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if ("contaclara.app.local".equalsIgnoreCase(uri.getHost())) return false;
                String scheme = uri.getScheme();
                if ("https".equalsIgnoreCase(scheme) || "http".equalsIgnoreCase(scheme)) {
                    try { startActivity(new Intent(Intent.ACTION_VIEW, uri)); }
                    catch (Exception ignored) {}
                    return true;
                }
                return false;
            }
        });
        web.setWebChromeClient(new WebChromeClient() {
            @Override public boolean onShowFileChooser(WebView view,
                ValueCallback<Uri[]> newCallback, FileChooserParams params) {
                if (chooserCallback != null) chooserCallback.onReceiveValue(null);
                chooserCallback = newCallback;
                try {
                    Intent pick = new Intent(Intent.ACTION_OPEN_DOCUMENT);
                    pick.addCategory(Intent.CATEGORY_OPENABLE);
                    pick.setType("*/*");
                    pick.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                    startActivityForResult(pick, PICK_FILE);
                } catch (Exception e) {
                    chooserCallback.onReceiveValue(null);
                    chooserCallback = null;
                    notifyUser("Não foi possível selecionar o arquivo.");
                }
                return true;
            }
        });
        setContentView(web);
        web.loadDataWithBaseURL(HOME, "<!doctype html><html lang='pt-BR'><meta name='viewport' content='width=device-width, initial-scale=1'><body style='font:16px system-ui;background:#f5f7fb;color:#17213b;display:grid;place-items:center;min-height:85vh;text-align:center'><main><h1>Conta Clara</h1><p>Carregando suas despesas...</p></main></body></html>", "text/html", "UTF-8", null);
        loadApplication();
    }

    private static String readText(InputStream stream) throws Exception {
        try (InputStream input = stream; ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[8192];
            int n;
            while ((n = input.read(buffer)) != -1) {
                out.write(buffer, 0, n);
                if (out.size() > 2000000) throw new IllegalArgumentException("Conteúdo inválido");
            }
            return out.toString(StandardCharsets.UTF_8.name());
        }
    }

    private static boolean validHTML(String html) {
        return html != null && html.contains("contaclara-v1")
          && html.contains("function exportReport(") && html.contains("Conta Clara");
    }

    private void loadApplication() {
        new Thread(() -> {
            String html = null;
            HttpURLConnection connection = null;
            try {
                URL url = new URL(REMOTE + "?v=" + System.currentTimeMillis());
                connection = (HttpURLConnection) url.openConnection();
                connection.setConnectTimeout(5500);
                connection.setReadTimeout(5500);
                connection.setRequestProperty("Cache-Control", "no-cache");
                if (connection.getResponseCode() != 200) throw new Exception("Versão indisponível");
                String received = readText(connection.getInputStream());
                if (!validHTML(received)) throw new Exception("Versão inválida");
                html = received;
                try (FileOutputStream out = openFileOutput("ultima-versao.html", MODE_PRIVATE)) {
                    out.write(received.getBytes(StandardCharsets.UTF_8));
                } catch (Exception ignored) {}
            } catch (Exception ignored) {
            } finally {
                if (connection != null) connection.disconnect();
            }

            if (html == null) {
                try { html = readText(openFileInput("ultima-versao.html")); }
                catch (Exception ignored) {}
            }
            if (!validHTML(html)) {
                try { html = readText(getAssets().open("offline.html")); }
                catch (Exception ignored) {}
            }
            final String result = html;
            runOnUiThread(() -> {
                if (result != null && web != null)
                    web.loadDataWithBaseURL(HOME, result, "text/html", "UTF-8", null);
                else notifyUser("Não foi possível carregar o aplicativo.");
            });
        }).start();
    }

    @Override protected void onActivityResult(int request, int result, Intent data) {
        super.onActivityResult(request, result, data);
        if (request == PICK_FILE) {
            if (chooserCallback != null) {
                Uri selected = result == RESULT_OK && data != null ? data.getData() : null;
                chooserCallback.onReceiveValue(selected == null ? null : new Uri[]{ selected });
                chooserCallback = null;
            }
        } else if (request == SAVE_FILE) {
            byte[] bytes = pendingExport;
            pendingExport = null;
            if (result == RESULT_OK && data != null && data.getData() != null && bytes != null) {
                try (OutputStream out = getContentResolver().openOutputStream(data.getData())) {
                    if (out == null) throw new Exception("Documento não disponível");
                    out.write(bytes);
                    notifyUser("Arquivo salvo com sucesso.");
                } catch (Exception e) {
                    notifyUser("Não foi possível salvar: " + e.getMessage());
                }
            }
        }
    }

    @Override public void onBackPressed() {
        if (web != null && web.canGoBack()) web.goBack();
        else super.onBackPressed();
    }

    @Override protected void onDestroy() {
        if (web != null) { web.destroy(); web = null; }
        super.onDestroy();
    }
}
