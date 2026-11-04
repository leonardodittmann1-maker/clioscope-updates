package com.meuponto.gitupdate;

import android.app.Activity;
import android.os.Bundle;
import android.content.Intent;
import android.content.ContentValues;
import android.graphics.Color;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Rect;
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
import org.json.JSONArray;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.FileNotFoundException;
import android.widget.Toast;
import java.io.ByteArrayOutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.text.TextRecognition;
import com.google.mlkit.vision.text.latin.TextRecognizerOptions;
import com.google.mlkit.vision.text.TextRecognizer;
import com.google.mlkit.vision.text.Text;

public class MainActivity extends Activity {
    private static final String HOME = "https://meuponto.app.local/";
    private static final String REMOTE = "https://raw.githubusercontent.com/leonardodittmann1-maker/clioscope-updates/meu-ponto-app/app.html";
    private static final String LAST_GOOD_FILE = "meuponto-last-good.html";
    private static final int REQ_PICK = 501;
    private static final int REQ_CAMERA = 502;
    private ValueCallback<Uri[]> callback;
    private Uri capturedPhoto;
    private boolean selectedFileIsImage = false;
    private boolean selectedFileIsSheet = false;
    private volatile String nextOcrMode = "receipt";
    private WebView web;
    private TextRecognizer recognizer;

    public final class NativeOCR {
        @JavascriptInterface public boolean isAvailable() { return true; }
        @JavascriptInterface public void setMode(String mode) { nextOcrMode = "sheet".equals(mode) ? "sheet" : "receipt"; }
        @JavascriptInterface public boolean supportsSheet() { return true; }
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
                    loadApplication(true);
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
                selectedFileIsSheet = "sheet".equals(nextOcrMode);
                nextOcrMode = "receipt";
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
        loadApplication(false);
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

    private String readCachedInterface() {
        try { return readText(openFileInput(LAST_GOOD_FILE)); }
        catch (Exception ignored) { return null; }
    }

    private void saveCachedInterface(String html) {
        try (OutputStream out = openFileOutput(LAST_GOOD_FILE, MODE_PRIVATE)) {
            out.write(html.getBytes(StandardCharsets.UTF_8));
        } catch (Exception ignored) {}
    }

    private void showUpdateMessage(String message) {
        runOnUiThread(() -> Toast.makeText(MainActivity.this, message, Toast.LENGTH_LONG).show());
    }

    private void loadApplication(boolean manualRefresh) {
        if (manualRefresh) showUpdateMessage("Verificando atualização no GitHub...");
        new Thread(() -> {
            String html = null;
            String error = "";
            boolean changed = false;
            // Uma tentativa com 4,5 segundos podia fazer o app voltar silenciosamente
            // para o HTML antigo incluído no APK. Agora repetimos e preservamos a última
            // interface válida, inclusive quando não houver conexão.
            for (int attempt = 0; attempt < 2 && html == null; attempt++) {
                HttpURLConnection connection = null;
                try {
                    URL url = new URL(REMOTE + "?v=" + System.currentTimeMillis() + "&r=" + attempt);
                    connection = (HttpURLConnection) url.openConnection();
                    connection.setConnectTimeout(10000);
                    connection.setReadTimeout(14000);
                    connection.setUseCaches(false);
                    connection.setRequestProperty("Cache-Control", "no-cache, no-store");
                    connection.setRequestProperty("Pragma", "no-cache");
                    if (connection.getResponseCode() != 200) {
                        throw new IllegalStateException("HTTP " + connection.getResponseCode());
                    }
                    String candidate = readText(connection.getInputStream());
                    if (!candidate.contains("ponto2_records") ||
                        !candidate.contains("__nativeOCRCallback") ||
                        !candidate.contains("</html>")) {
                        throw new IllegalStateException("Arquivo incompleto ou inválido");
                    }
                    html = candidate;
                } catch (Exception e) {
                    error = e.getMessage() == null ? e.getClass().getSimpleName() : e.getMessage();
                } finally {
                    if (connection != null) connection.disconnect();
                }
            }

            if (html != null) {
                String previous = readCachedInterface();
                changed = previous == null || !previous.equals(html);
                saveCachedInterface(html);
            } else if (!manualRefresh) {
                // Primeira abertura offline: usa a última versão baixada, não a antiga.
                html = readCachedInterface();
                if (html == null) {
                    try { html = readText(getAssets().open("offline.html")); }
                    catch (Exception ignored) {}
                }
            }

            final String result = html;
            final boolean newContent = changed;
            final String failure = error;
            runOnUiThread(() -> {
                if (result == null) {
                    if (manualRefresh) {
                        Toast.makeText(MainActivity.this,
                            "Não consegui baixar a atualização (" + failure + "). Versão atual mantida.",
                            Toast.LENGTH_LONG).show();
                    }
                    return;
                }
                if (web != null) web.loadDataWithBaseURL(HOME, result, "text/html", "UTF-8", null);
                if (manualRefresh) {
                    Toast.makeText(MainActivity.this,
                        newContent ? "Interface atualizada com sucesso." : "Interface conferida: versão mais recente carregada.",
                        Toast.LENGTH_LONG).show();
                }
            });
        }).start();
    }

    private void showOcrResult(String text, String error) {
        final String js = "window.__nativeOCRCallback && window.__nativeOCRCallback("
               +JSONObject.quote(text == null ? "" : text)+","
               +JSONObject.quote(error == null ? "" : error)+");";
        runOnUiThread(() -> { if(web != null) web.evaluateJavascript(js,null); });
    }


    private void showSheetResult(Text result, String error) {
        JSONObject payload=new JSONObject();
        try {
            payload.put("text",result == null ? "" : result.getText());
            JSONArray lines=new JSONArray();
            if(result != null)for(Text.TextBlock block:result.getTextBlocks())for(Text.Line line:block.getLines()){
                Rect r=line.getBoundingBox();
                if(r == null)continue;
                JSONObject obj=new JSONObject();
                obj.put("text",line.getText());
                obj.put("x",r.left);obj.put("y",r.top);
                obj.put("w",r.width());obj.put("h",r.height());
                lines.put(obj);
            }
            payload.put("lines",lines);
        }catch(Exception ignored){}
        final String js="window.__nativeSheetOCRCallback && window.__nativeSheetOCRCallback("
             +JSONObject.quote(payload.toString())+","+JSONObject.quote(error==null?"":error)+");";
        runOnUiThread(()->{if(web!=null)web.evaluateJavascript(js,null);});
    }
    private int countSheetDates(String value){
        java.util.regex.Matcher m=java.util.regex.Pattern.compile(
            "(?<![0-9])(?:0?[1-9]|[12][0-9]|3[01])[/.-](?:0?[1-9]|1[0-2])[/.-]20[0-9]{2}(?![0-9])"
        ).matcher(value==null?"":value);
        int n=0;while(m.find())n++;return n;
    }
    private void trySheetRotation(Bitmap bitmap,int[] angles,int index,Text best,int bestScore){
        if(index>=angles.length||bestScore>=7){
            showSheetResult(best,bestScore<2?"Poucas datas reconhecidas: confira o enquadramento da folha.":"");
            bitmap.recycle();return;
        }
        try{
            recognizer.process(InputImage.fromBitmap(bitmap,angles[index]))
                .addOnSuccessListener(result->{
                    int score=countSheetDates(result.getText());
                    trySheetRotation(bitmap,angles,index+1,score>bestScore?result:best,Math.max(bestScore,score));
                }).addOnFailureListener(error->trySheetRotation(bitmap,angles,index+1,best,bestScore));
        }catch(Exception error){trySheetRotation(bitmap,angles,index+1,best,bestScore);}
    }
    private void recognizeSheet(Uri uri){
        new Thread(()->{
            try{
                InputImage image=InputImage.fromFilePath(getApplicationContext(),uri);
                recognizer.process(image).addOnSuccessListener(result->{
                    int score=countSheetDates(result.getText());
                    if(score>=5){showSheetResult(result,"");return;}
                    try{
                        BitmapFactory.Options opts=new BitmapFactory.Options();
                        opts.inJustDecodeBounds=true;
                        try(InputStream in=getContentResolver().openInputStream(uri)){
                            BitmapFactory.decodeStream(in,null,opts);
                        }
                        int biggest=Math.max(opts.outWidth,opts.outHeight),sample=1;
                        while(biggest/sample>3800)sample*=2;
                        opts.inJustDecodeBounds=false;opts.inSampleSize=sample;
                        Bitmap bmp;
                        try(InputStream in=getContentResolver().openInputStream(uri)){
                            bmp=BitmapFactory.decodeStream(in,null,opts);
                        }
                        if(bmp==null){showSheetResult(result,"Não foi possível girar a imagem.");return;}
                        trySheetRotation(bmp,new int[]{90,270,180},0,result,score);
                    }catch(Exception e){showSheetResult(result,"Leitura incompleta: "+e.getMessage());}
                }).addOnFailureListener(err->showSheetResult(null,"Falha no OCR: "+err.getMessage()));
            }catch(Exception e){showSheetResult(null,"Não foi possível abrir a folha: "+e.getMessage());}
        }).start();
    }
    private void recognizePhoto(Uri uri, boolean sheet) {
        if(sheet){recognizeSheet(uri);return;}
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
        if(uri != null && selectedFileIsImage) recognizePhoto(uri,selectedFileIsSheet);
        selectedFileIsImage = false;
        selectedFileIsSheet = false;
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
