package br.com.enade.eletrica;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.MimeTypeMap;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Locale;

/**
 * Aplicativo Android dedicado ao ENADE. Conteúdo inteiramente embarcado no APK,
 * sem servidor público e sem dependência de rede para estudar.
 *
 * O endereço HTTPS abaixo é uma origem LOCAL virtual para WebView/IndexedDB;
 * não existe site publicado nesse domínio. Links externos abrem navegador comum.
 */
public final class MainActivity extends Activity {
    private static final int CHOOSE_FILE = 501;
    private static final int SAVE_BACKUP = 502;
    private static final String HOST = "appassets.androidplatform.net";
    private static final String LOCAL_BASE = "https://" + HOST + "/assets/";
    private WebView webView;
    private android.webkit.ValueCallback<Uri[]> fileCallback;
    private String pendingBackup;

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        webView = new WebView(this);
        webView.setBackgroundColor(0xfff4f7fb);
        webView.setOverScrollMode(WebView.OVER_SCROLL_NEVER);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        webView.addJavascriptInterface(new BackupBridge(), "AndroidBackup");
        webView.setWebViewClient(new WebViewClient() {
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (!"https".equals(uri.getScheme()) || !HOST.equals(uri.getHost()) || uri.getPath() == null || !uri.getPath().startsWith("/assets/")) return null;
                String path = uri.getPath().substring("/assets/".length());
                if (path.isEmpty()) path = "index.html";
                if (path.contains("..") || path.contains("\\") || path.startsWith("/")) return new WebResourceResponse("text/plain", "UTF-8", 404, "Blocked", null, InputStream.nullInputStream());
                try {
                    InputStream data = getAssets().open(path);
                    String mime;
                    if (path.endsWith(".html")) mime = "text/html";
                    else if (path.endsWith(".js")) mime = "text/javascript";
                    else if (path.endsWith(".css")) mime = "text/css";
                    else if (path.endsWith(".json") || path.endsWith(".webmanifest")) mime = "application/json";
                    else if (path.endsWith(".png")) mime = "image/png";
                    else if (path.endsWith(".svg")) mime = "image/svg+xml";
                    else mime = "application/octet-stream";
                    return new WebResourceResponse(mime, "UTF-8", data);
                } catch (Exception ignored) {
                    return new WebResourceResponse("text/plain", "UTF-8", 404, "Not Found", null, InputStream.nullInputStream());
                }
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if ("https".equals(uri.getScheme()) && HOST.equals(uri.getHost()) && uri.getPath() != null && uri.getPath().startsWith("/assets/")) return false;
                if (request.isForMainFrame()) {
                    if ("http".equals(uri.getScheme()) || "https".equals(uri.getScheme()) || "mailto".equals(uri.getScheme())) {
                        try { startActivity(new Intent(Intent.ACTION_VIEW, uri)); }
                        catch (ActivityNotFoundException ignored) { Toast.makeText(MainActivity.this, "Não foi possível abrir o link.", Toast.LENGTH_SHORT).show(); }
                    }
                    return true;
                }
                return false;
            }
        });
        webView.setWebChromeClient(new WebChromeClient() {
            @Override public boolean onShowFileChooser(WebView view, android.webkit.ValueCallback<Uri[]> callback, FileChooserParams params) {
                if (fileCallback != null) fileCallback.onReceiveValue(null);
                fileCallback = callback;
                try { startActivityForResult(params.createIntent(), CHOOSE_FILE); return true; }
                catch (Exception e) { fileCallback = null; callback.onReceiveValue(null); return false; }
            }
        });
        setContentView(webView);
        if (state != null) webView.restoreState(state);
        else webView.loadUrl(LOCAL_BASE + "index.html");
    }

    private final class BackupBridge {
        /** Only the bundled local application calls this bridge; data is not uploaded. */
        @JavascriptInterface public void exportBackup(String json, String suggestedName) {
            if (json == null || json.length() > 10_000_000) return;
            runOnUiThread(() -> {
                pendingBackup = json;
                Intent i = new Intent(Intent.ACTION_CREATE_DOCUMENT);
                i.setType("application/json");
                i.addCategory(Intent.CATEGORY_OPENABLE);
                String safe = suggestedName == null ? "enade-backup.json" : suggestedName.replaceAll("[^a-zA-Z0-9._-]", "_");
                i.putExtra(Intent.EXTRA_TITLE, safe);
                try { startActivityForResult(i, SAVE_BACKUP); }
                catch (ActivityNotFoundException e) { Toast.makeText(MainActivity.this, "Nenhum gerenciador de arquivos disponível.", Toast.LENGTH_LONG).show(); }
            });
        }
    }

    @Override protected void onActivityResult(int request, int result, Intent intent) {
        super.onActivityResult(request, result, intent);
        if (request == CHOOSE_FILE) {
            if (fileCallback != null) {
                Uri[] uris = WebChromeClient.FileChooserParams.parseResult(result, intent);
                fileCallback.onReceiveValue(uris);
                fileCallback = null;
            }
        } else if (request == SAVE_BACKUP) {
            if (result == RESULT_OK && intent != null && intent.getData() != null && pendingBackup != null) {
                try (OutputStream stream = getContentResolver().openOutputStream(intent.getData())) {
                    if (stream == null) throw new Exception("Fluxo indisponível");
                    stream.write(pendingBackup.getBytes(StandardCharsets.UTF_8));
                    Toast.makeText(this, "Backup ENADE salvo", Toast.LENGTH_SHORT).show();
                } catch (Exception e) { Toast.makeText(this, "Erro ao salvar backup", Toast.LENGTH_LONG).show(); }
            }
            pendingBackup = null;
        }
    }
    @Override public void onBackPressed() {
        if (webView != null && webView.canGoBack()) webView.goBack();
        else super.onBackPressed();
    }
    @Override protected void onSaveInstanceState(Bundle state) {
        if (webView != null) webView.saveState(state);
        super.onSaveInstanceState(state);
    }
    @Override protected void onDestroy() {
        if (webView != null) { webView.removeJavascriptInterface("AndroidBackup"); webView.destroy(); webView = null; }
        super.onDestroy();
    }
}
