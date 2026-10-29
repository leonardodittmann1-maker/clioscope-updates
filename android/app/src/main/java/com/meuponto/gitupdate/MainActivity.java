package com.meuponto.gitupdate;

import android.app.Activity;
import android.os.Bundle;
import android.content.Intent;
import android.content.ContentValues;
import android.graphics.Color;
import android.net.Uri;
import android.provider.MediaStore;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.ValueCallback;
import org.json.JSONObject;
import java.io.InputStream;
import java.io.ByteArrayOutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.text.TextRecognition;
import com.google.mlkit.vision.text.latin.TextRecognizerOptions;
import com.google.mlkit.vision.text.TextRecognizer;

public class MainActivity extends Activity {
    private static final String HOME = "https://meuponto.app.local/";
    private static final String REMOTE = "https://raw.githubusercontent.com/leonardodittmann1-maker/clioscope-updates/meu-ponto-app/app.html";
    private static final int REQ_PICK = 501;
    private static final int REQ_CAMERA = 502;
    private ValueCallback<Uri[]> callback;
    private Uri capturedPhoto;
    private boolean selectedFileIsImage = false;
    private WebView web;
    private TextRecognizer recognizer;

    public final class NativeOCR {
        @JavascriptInterface public boolean isAvailable() { return true; }
    }

    @Override public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setStatusBarColor(Color.rgb(250,248,245));
        getWindow().setNavigationBarColor(Color.BLACK);
        getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
        web = new WebView(this);
        WebSettings st = web.getSettings();
        st.setJavaScriptEnabled(true);
        st.setDomStorageEnabled(true);
        st.setAllowFileAccess(false);
        st.setDefaultTextEncodingName("UTF-8");
        web.addJavascriptInterface(new NativeOCR(), "MeupontoOCR");
        recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS);
        web.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri target = request.getUrl();
                if ("meuponto.app.local".equals(target.getHost()) && "/refresh".equals(target.getPath())) {
                    loadApplication();
                    return true;
                }
                if ("http".equals(target.getScheme()) || "https".equals(target.getScheme())) {
                    try { startActivity(new Intent(Intent.ACTION_VIEW, target)); }
                    catch (Exception ignored) {}
                    return true;
                }
                return false;
            }
        });
        web.setWebChromeClient(new WebChromeClient() {
            @Override public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> newCallback, FileChooserParams params) {
                if (callback != null) callback.onReceiveValue(null);
                callback = newCallback;
                capturedPhoto = null;
                selectedFileIsImage = false;
                boolean wantsDocument = false;
                String[] accepts = params.getAcceptTypes();
                if (accepts != null) {
                    for (String accept : accepts) {
                        if (accept == null) continue;
                        String mime = accept.toLowerCase(java.util.Locale.ROOT);
                        if (mime.contains("json") || mime.contains("text/plain") || mime.contains("octet-stream")) {
                            wantsDocument = true;
                            break;
                        }
                    }
                }
                try {
                    if (params.isCaptureEnabled() && !wantsDocument) {
                        selectedFileIsImage = true;
                        ContentValues values = new ContentValues();
                        values.put(MediaStore.Images.Media.DISPLAY_NAME, "meu_ponto_"+System.currentTimeMillis()+".jpg");
                        values.put(MediaStore.Images.Media.MIME_TYPE, "image/jpeg");
                        capturedPhoto = getContentResolver().insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values);
                        if (capturedPhoto == null) throw new IllegalStateException("Não foi possível preparar a foto");
                        Intent cam = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                        cam.putExtra(MediaStore.EXTRA_OUTPUT, capturedPhoto);
                        cam.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION | Intent.FLAG_GRANT_READ_URI_PERMISSION);
                        startActivityForResult(cam, REQ_CAMERA);
                    } else if (wantsDocument) {
                        // O backup JSON deve abrir o seletor de documentos, não a galeria.
                        selectedFileIsImage = false;
                        Intent document = new Intent(Intent.ACTION_OPEN_DOCUMENT);
                        document.addCategory(Intent.CATEGORY_OPENABLE);
                        document.setType("*/*");
                        document.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                        startActivityForResult(Intent.createChooser(document,"Selecionar backup JSON"),REQ_PICK);
                    } else {
                        selectedFileIsImage = true;
                        Intent gallery = new Intent(Intent.ACTION_GET_CONTENT);
                        gallery.setType("image/*");
                        gallery.addCategory(Intent.CATEGORY_OPENABLE);
                        startActivityForResult(Intent.createChooser(gallery,"Escolher comprovante"), REQ_PICK);
                    }
                } catch (Exception e) {
                    if (callback != null) callback.onReceiveValue(null);
                    callback = null;
                    capturedPhoto = null;
                }
                return true;
            }
        });
        setContentView(web);
        loadApplication();
    }

    private static String readText(InputStream input) throws Exception {
        try (InputStream in = input; ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[8192]; int count;
            while ((count = in.read(buffer)) != -1) {
                out.write(buffer,0,count);
                if (out.size() > 500000) throw new IllegalStateException("Arquivo muito grande");
            }
            return new String(out.toByteArray(), StandardCharsets.UTF_8);
        }
    }

    private void loadApplication() {
        new Thread(() -> {
            String html = null;
            HttpURLConnection connection = null;
            try {
                URL url = new URL(REMOTE+"?at="+System.currentTimeMillis());
                connection = (HttpURLConnection)url.openConnection();
                connection.setConnectTimeout(4500);
                connection.setReadTimeout(4500);
                connection.setRequestProperty("Cache-Control","no-cache");
                if (connection.getResponseCode() != 200) throw new Exception("Sem versão online");
                html = readText(connection.getInputStream());
                if (!html.contains("ponto2_records") || !html.contains("__nativeOCRCallback")) throw new Exception("Conteúdo inválido");
            } catch (Exception ignored) {}
            finally { if (connection != null) connection.disconnect(); }
            if (html == null) {
                try { html = readText(getAssets().open("offline.html")); } catch (Exception ignored) {}
            }
            final String result = html;
            runOnUiThread(() -> {
                if (result != null && web != null)
                    web.loadDataWithBaseURL(HOME,result,"text/html","UTF-8",null);
            });
        }).start();
    }

    private void showOcrResult(String text, String error) {
        final String js = "window.__nativeOCRCallback && window.__nativeOCRCallback("
               +JSONObject.quote(text == null ? "" : text)+","
               +JSONObject.quote(error == null ? "" : error)+");";
        runOnUiThread(() -> { if(web != null) web.evaluateJavascript(js,null); });
    }

    private void recognizePhoto(Uri uri) {
        new Thread(() -> {
            try {
                InputImage image = InputImage.fromFilePath(getApplicationContext(),uri);
                recognizer.process(image)
                    .addOnSuccessListener(result -> showOcrResult(result.getText(), ""))
                    .addOnFailureListener(err -> showOcrResult("", "Erro na leitura: "+err.getMessage()));
            } catch (Exception e) {
                showOcrResult("", "Não foi possível abrir a foto: "+e.getMessage());
            }
        }).start();
    }

    @Override protected void onActivityResult(int req, int result, Intent data) {
        super.onActivityResult(req,result,data);
        if (callback == null) return;
        Uri uri = null;
        if (result == RESULT_OK) {
            if (req == REQ_CAMERA) uri = capturedPhoto;
            else if (req == REQ_PICK && data != null) uri = data.getData();
        }
        callback.onReceiveValue(uri == null ? null : new Uri[]{uri});
        callback = null;
        capturedPhoto = null;
        if(uri != null && selectedFileIsImage) recognizePhoto(uri);
        selectedFileIsImage = false;
    }

    @Override public void onBackPressed() {
        if (web != null && web.canGoBack()) web.goBack();
        else super.onBackPressed();
    }

    @Override protected void onDestroy(){
        if(recognizer != null) recognizer.close();
        super.onDestroy();
    }
}
