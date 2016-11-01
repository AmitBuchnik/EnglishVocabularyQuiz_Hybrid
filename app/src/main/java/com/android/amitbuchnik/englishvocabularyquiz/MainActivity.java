package com.android.amitbuchnik.englishvocabularyquiz;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.webkit.WebSettings;
import android.webkit.WebView;

public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Thread.setDefaultUncaughtExceptionHandler(new Thread.UncaughtExceptionHandler() {
            @Override
            public void uncaughtException(Thread paramThread, Throwable paramThrowable) {
                Log.e("Alert", paramThrowable.getCause().getMessage());
            }
        });

        WebView.setWebContentsDebuggingEnabled(true);

        WebView webView = new WebView(this);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);// allow local storage
        settings.setAllowUniversalAccessFromFileURLs(true);// allow ajax from file url
        webView.loadUrl("file:///android_asset/www/englishquiz.html");
        setContentView(webView);
    }
}
