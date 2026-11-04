package com.meuponto.gitupdate;

import android.app.Activity;
import android.os.Bundle;
import android.content.Intent;
import android.content.ContentValues;
import android.graphics.Color;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Rect;
import android.graphics.Matrix;
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


    // Guarda as coordenadas das linhas para associar batidas à linha e
    // à coluna corretas no espelho mensal.
    private JSONArray sheetLines(Text result) throws Exception {
        JSONArray lines = new JSONArray();
        if(result == null)return lines;
        for(Text.TextBlock block:result.getTextBlocks()){
            for(Text.Line line:block.getLines()){
                Rect r=line.getBoundingBox();
                if(r==null)continue;
                JSONObject obj=new JSONObject();
                obj.put("text",line.getText());
                obj.put("x",r.left);obj.put("y",r.top);
                obj.put("w",r.width());obj.put("h",r.height());
                // Palavras isoladas permitem reconhecer corretamente números
                // mesmo quando o OCR uniu linhas inteiras do espelho.
                JSONArray words=new JSONArray();
                for(Text.Element word:line.getElements()){
                    Rect w=word.getBoundingBox();
                    if(w==null)continue;
                    JSONObject token=new JSONObject();
                    token.put("text",word.getText());
                    token.put("x",w.left);token.put("y",w.top);
                    token.put("w",w.width());token.put("h",w.height());
                    words.put(token);
                }
                obj.put("words",words);
                lines.put(obj);
            }
        }
        return lines;
    }
    private void showSheetResult(Text best,Text enhanced,String error,int rotation,int foundDates){
        JSONObject payload=new JSONObject();
        try{
            payload.put("text",best==null?"":best.getText());
            payload.put("lines",sheetLines(best));
            payload.put("rotation",rotation);
            payload.put("datesDetected",foundDates);
            if(enhanced!=null){
                JSONArray variants=new JSONArray();
                JSONObject extra=new JSONObject();
                extra.put("text",enhanced.getText());
                extra.put("lines",sheetLines(enhanced));
                extra.put("method","enhanced-zoom");
                variants.put(extra);
                payload.put("variants",variants);
            }
        }catch(Exception ignored){}
        final String js="window.__nativeSheetOCRCallback && window.__nativeSheetOCRCallback("
            +JSONObject.quote(payload.toString())+","+JSONObject.quote(error==null?"":error)+");";
        runOnUiThread(()->{if(web!=null)web.evaluateJavascript(js,null);});
    }
    private void sheetProgress(String message){
        final String js="window.__nativeSheetOCRProgress && window.__nativeSheetOCRProgress("
            +JSONObject.quote(message)+");";
        runOnUiThread(()->{if(web!=null)web.evaluateJavascript(js,null);});
    }
    private int countSheetDates(String value){
        java.util.regex.Matcher m=java.util.regex.Pattern.compile(
            "(?<![0-9])(?:0?[1-9]|[12][0-9]|3[01])[/.-](?:0?[1-9]|1[0-2])[/.-]20[0-9]{2}(?![0-9])"
        ).matcher(value==null?"":value);
        java.util.HashSet<String> unique=new java.util.HashSet<>();
        while(m.find())unique.add(m.group());
        return unique.size();
    }
    private int sheetTimeCount(String text){
        java.util.regex.Matcher matcher=java.util.regex.Pattern.compile(
            "(?<![0-9])[0-2]?[0-9][:][0-5][0-9](?![0-9])"
        ).matcher(text==null?"":text);
        int n=0;while(matcher.find())n++;return n;
    }
    private static class SheetCandidate{
        Text text;
        int rotation,dates,punches,score;
        SheetCandidate(Text result,int angle,int count,int times,int quality){
            text=result;rotation=angle;dates=count;punches=times;score=quality;
        }
    }
    private SheetCandidate sheetCandidate(Text text,int rotation){
        int dates=countSheetDates(text.getText()),times=sheetTimeCount(text.getText());
        int score=dates*1000+Math.min(times,140)*3;
        // Prefere datas alinhadas verticalmente, próprias de uma tabela.
        java.util.ArrayList<Integer> xs=new java.util.ArrayList<>();
        java.util.regex.Pattern day=java.util.regex.Pattern.compile(
           "(?<![0-9])(?:0?[1-9]|[12][0-9]|3[01])[/.-](?:0?[1-9]|1[0-2])[/.-]20[0-9]{2}(?![0-9])");
        for(Text.TextBlock b:text.getTextBlocks())for(Text.Line line:b.getLines()){
            if(day.matcher(line.getText()).find()&&line.getBoundingBox()!=null)
                xs.add(line.getBoundingBox().left);
        }
        if(xs.size()>3){
            java.util.Collections.sort(xs);
            int mid=xs.get(xs.size()/2),near=0;
            for(int x:xs)if(Math.abs(x-mid)<100)near++;
            score+=Math.min(near,31)*12;
        }
        return new SheetCandidate(text,rotation,dates,times,score);
    }
    private void readSheetRotations(Bitmap source,int[] angles,int index,SheetCandidate best){
        if(index>=angles.length||(best!=null&&best.dates>=30&&best.punches>=55)){
            if(best==null){
                source.recycle();
                showSheetResult(null,null,"Não foi possível ler esta foto.",0,0);
                return;
            }
            enhanceSheet(source,best);
            return;
        }
        final int rotation=angles[index];
        try{
            recognizer.process(InputImage.fromBitmap(source,rotation))
                .addOnSuccessListener(result->{
                    SheetCandidate candidate=sheetCandidate(result,rotation);
                    SheetCandidate selected=best==null||candidate.score>best.score?candidate:best;
                    readSheetRotations(source,angles,index+1,selected);
                })
                .addOnFailureListener(error->readSheetRotations(source,angles,index+1,best));
        }catch(Exception ignored){readSheetRotations(source,angles,index+1,best);}
    }
    private Bitmap sheetContrast(Bitmap source){
        int width=source.getWidth(),height=source.getHeight();
        int[] colors=new int[width*height];
        source.getPixels(colors,0,width,0,0,width,height);
        for(int i=0;i<colors.length;i++){
            int c=colors[i];
            int lum=((Color.red(c)*77)+(Color.green(c)*150)+(Color.blue(c)*29))>>8;
            // O papel fica branco e a impressão escura mais evidente.
            int v=Math.max(0,Math.min(255,(int)((lum-185)*1.55+220)));
            colors[i]=Color.rgb(v,v,v);
        }
        Bitmap clean=Bitmap.createBitmap(width,height,Bitmap.Config.ARGB_8888);
        clean.setPixels(colors,0,width,0,0,width,height);
        return clean;
    }
    private Bitmap zoomSheetRegion(Bitmap upright,Text baseline){
        int w=upright.getWidth(),h=upright.getHeight();
        // A entrada e a saída ocupam a parte esquerda do espelho.
        // Identifica as datas pelo OCR para evitar cortar outros modelos.
        java.util.ArrayList<Integer> dates=new java.util.ArrayList<>();
        java.util.regex.Pattern rx=java.util.regex.Pattern.compile(
           "(?<![0-9])(?:0?[1-9]|[12][0-9]|3[01])[/.-](?:0?[1-9]|1[0-2])[/.-]20[0-9]{2}(?![0-9])");
        for(Text.TextBlock b:baseline.getTextBlocks())
            for(Text.Line line:b.getLines())
                if(rx.matcher(line.getText()).find()&&line.getBoundingBox()!=null)
                    dates.add(line.getBoundingBox().left);
        if(dates.size()<3)return upright;
        java.util.Collections.sort(dates);
        int dateX=dates.get(dates.size()/2);
        int left=Math.max(0,dateX-(int)(w*.065));
        // Evita as colunas Trabalho/BB/Saldo à direita. A última batida
        // é a coluna Saída, que está próxima da metade da página.
        int right=Math.min(w,Math.max(left+(int)(w*.52),(int)(w*.72)));
        if(right-left<w*.37)return upright;
        return Bitmap.createBitmap(upright,left,0,right-left,h);
    }
    private void enhanceSheet(Bitmap source,SheetCandidate candidate){
        sheetProgress("Ampliando e realçando os horários da folha...");
        new Thread(()->{
            Bitmap upright=null,region=null,clean=null;
            try{
                Matrix rotation=new Matrix();
                rotation.postRotate(candidate.rotation);
                upright=Bitmap.createBitmap(source,0,0,source.getWidth(),source.getHeight(),rotation,true);
                // A recortada pode ficar mais nítida para o leitor, e as
                // coordenadas são independentes na segunda versão OCR.
                region=zoomSheetRegion(upright,candidate.text);
                clean=sheetContrast(region);
                Bitmap finalClean=clean,finalUpright=upright,finalRegion=region;
                recognizer.process(InputImage.fromBitmap(finalClean,0))
                    .addOnSuccessListener(result->{
                        showSheetResult(candidate.text,result,"",candidate.rotation,candidate.dates);
                        finalClean.recycle();
                        if(finalRegion!=finalUpright)finalRegion.recycle();
                        finalUpright.recycle();source.recycle();
                    })
                    .addOnFailureListener(error->{
                        showSheetResult(candidate.text,null,
                           "O realce não terminou; os dados encontrados podem ser revisados.",
                           candidate.rotation,candidate.dates);
                        finalClean.recycle();
                        if(finalRegion!=finalUpright)finalRegion.recycle();
                        finalUpright.recycle();source.recycle();
                    });
            }catch(Exception error){
                if(clean!=null)clean.recycle();
                if(region!=null&&region!=upright)region.recycle();
                if(upright!=null)upright.recycle();
                source.recycle();
                showSheetResult(candidate.text,null,
                    "Leitura parcial: confira as datas e horários.",candidate.rotation,candidate.dates);
            }
        }).start();
    }
    private void recognizeSheet(Uri uri){
        sheetProgress("Localizando a orientação e as datas da folha...");
        new Thread(()->{
            try{
                BitmapFactory.Options options=new BitmapFactory.Options();
                options.inJustDecodeBounds=true;
                try(InputStream in=getContentResolver().openInputStream(uri)){
                    BitmapFactory.decodeStream(in,null,options);
                }
                if(options.outWidth<=0||options.outHeight<=0)
                    throw new IllegalStateException("Formato de imagem inválido");
                int sample=1,longer=Math.max(options.outWidth,options.outHeight);
                while(longer/sample>3600)sample*=2;
                options.inJustDecodeBounds=false;options.inSampleSize=sample;
                Bitmap image;
                try(InputStream in=getContentResolver().openInputStream(uri)){
                    image=BitmapFactory.decodeStream(in,null,options);
                }
                if(image==null)throw new IllegalStateException("Não foi possível decodificar a foto");
                int longest=Math.max(image.getWidth(),image.getHeight());
                if(longest<2450){
                    double scale=Math.min(2.3,3000.0/longest);
                    Bitmap enlarged=Bitmap.createScaledBitmap(image,
                       (int)Math.round(image.getWidth()*scale),
                       (int)Math.round(image.getHeight()*scale),true);
                    if(enlarged!=image)image.recycle();
                    image=enlarged;
                }
                readSheetRotations(image,new int[]{0,90,270,180},0,null);
            }catch(Exception error){
                showSheetResult(null,null,"Falha ao ler a folha: "+error.getMessage(),0,0);
            }
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
