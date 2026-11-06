package br.com.contaclara.app;

import android.app.Notification;
import android.content.SharedPreferences;
import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import org.json.JSONArray;
import org.json.JSONObject;

/** Listener opt-in do Samsung Wallet, que só guarda dados de compras reconhecidas. */
public class WalletNotificationService extends NotificationListenerService {
    static final String PACKAGE_NAME="com.samsung.android.spay";
    static final String OPTIONS="wallet_options";
    static final String STORAGE="wallet_events";

    @Override public void onNotificationPosted(StatusBarNotification posted) {
        if(posted==null||!PACKAGE_NAME.equals(posted.getPackageName()))return;
        if(!getSharedPreferences(OPTIONS,MODE_PRIVATE).getBoolean("enabled",false))return;
        Notification message=posted.getNotification();
        if(message==null||message.extras==null)return;
        CharSequence title=message.extras.getCharSequence(Notification.EXTRA_TITLE);
        CharSequence details=message.extras.getCharSequence(Notification.EXTRA_BIG_TEXT);
        if(details==null)details=message.extras.getCharSequence(Notification.EXTRA_TEXT);
        if(details==null)return;
        WalletPurchaseParser.Purchase item=WalletPurchaseParser.parse(
            title==null?"":title.toString(),details.toString(),posted.getPostTime());
        if(item==null)return;
        synchronized(WalletNotificationService.class) {
            try {
                SharedPreferences prefs=getSharedPreferences(STORAGE,MODE_PRIVATE);
                JSONArray old=new JSONArray(prefs.getString("queue","[]")),newQueue=new JSONArray();
                String id=posted.getKey()+"|"+posted.getPostTime()+"|"+item.cents;
                for(int i=0;i<old.length();i++){
                    JSONObject previous=old.optJSONObject(i);
                    if(previous==null)continue;
                    if(id.equals(previous.optString("id")))return;
                    newQueue.put(previous);
                }
                JSONObject purchase=new JSONObject();
                purchase.put("id",id);
                purchase.put("date",item.date);
                purchase.put("merchant",item.merchant);
                purchase.put("cents",item.cents);
                purchase.put("review",item.review);
                newQueue.put(purchase);
                JSONArray bounded=new JSONArray();
                for(int i=Math.max(0,newQueue.length()-150);i<newQueue.length();i++)bounded.put(newQueue.get(i));
                prefs.edit().putString("queue",bounded.toString()).apply();
            } catch(Exception ignored) {}
        }
    }
}
