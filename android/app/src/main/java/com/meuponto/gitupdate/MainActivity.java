package com.meuponto.gitupdate;

import android.app.Activity;
import android.os.Bundle;
import android.content.Intent;
import android.content.ContentValues;
import android.graphics.Color;
import android.net.Uri;
import android.provider.MediaStore;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.ValueCallback;

public class MainActivity extends Activity {
    private static final int REQ_PICK = 501;
    private static final int REQ_CAMERA = 502;
    private ValueCallback<Uri[]> callback;
    private Uri capturedPhoto;
    private WebView web;

    @Override public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setStatusBarColor(Color.rgb(250,248,245));
        getWindow().setNavigationBarColor(Color.BLACK);
        getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
        web = new WebView(this);
        WebSettings st = web.getSettings();
        st.setJavaScriptEnabled(true);
        st.setDomStorageEnabled(true);
        st.setAllowFileAccess(true);
        st.setDefaultTextEncodingName("UTF-8");
        web.setWebViewClient(new WebViewClient());
        web.setWebChromeClient(new WebChromeClient() {
            @Override public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> newCallback, FileChooserParams params) {
                if (callback != null) callback.onReceiveValue(null);
                callback = newCallback;
                capturedPhoto = null;
                try {
                    if (params.isCaptureEnabled()) {
                        ContentValues values = new ContentValues();
                        values.put(MediaStore.Images.Media.DISPLAY_NAME, "meu_ponto_"+System.currentTimeMillis()+".jpg");
                        values.put(MediaStore.Images.Media.MIME_TYPE, "image/jpeg");
                        capturedPhoto = getContentResolver().insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values);
                        if (capturedPhoto == null) throw new IllegalStateException("Não foi possível preparar a foto");
                        Intent cam = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                        cam.putExtra(MediaStore.EXTRA_OUTPUT, capturedPhoto);
                        cam.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION | Intent.FLAG_GRANT_READ_URI_PERMISSION);
                        startActivityForResult(cam, REQ_CAMERA);
                    } else {
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
        web.loadUrl("file:///android_asset/index.html");
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
    }
    @Override public void onBackPressed() {
        if (web != null && web.canGoBack()) web.goBack();
        else super.onBackPressed();
    }
}
