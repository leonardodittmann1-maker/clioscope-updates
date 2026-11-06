package br.com.contaclara.app;

import java.text.Normalizer;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/** Locally extracts a candidate purchase from Samsung Wallet notification text. */
public final class WalletPurchaseParser {
    private static final Pattern VALUE=Pattern.compile("R\\$\\s*([\\d.]+,\\d{2})",Pattern.CASE_INSENSITIVE);
    private static final Pattern MERCHANT=Pattern.compile(
      "(?:\\bem\\s+|\\bno\\s+|\\bna\\s+|\\bpara\\s+|estabelecimento\\s*:\\s*|loja\\s*:\\s*)([\\p{L}\\p{N}][\\p{L}\\p{N} ./'&_-]{1,90})",
      Pattern.CASE_INSENSITIVE|Pattern.UNICODE_CASE);
    private static final DateTimeFormatter DAY=DateTimeFormatter.ofPattern("uuuu-MM-dd",Locale.ROOT);
    public static final class Purchase {
        public final String date,merchant;
        public final long cents;
        public final boolean review;
        Purchase(String date,String merchant,long cents,boolean review){this.date=date;this.merchant=merchant;this.cents=cents;this.review=review;}
    }
    private static String normalize(String input) {
        return Normalizer.normalize(input==null?"":input,Normalizer.Form.NFD)
            .replaceAll("\\p{M}+","").toLowerCase(Locale.ROOT).replaceAll("\\s+"," ").trim();
    }
    public static Purchase parse(String title,String detail,long time){
        String joined=(title==null?"":title)+" "+(detail==null?"":detail);
        if(joined.length()>2000)joined=joined.substring(0,2000);
        String n=normalize(joined);
        if(n.matches("(?s).*(?:\\bpix\\b|transferencia|\\bfatura\\b|boleto|estorno|reembolso|cancelad|limite|saldo|cashback|saque|deposito|emprestimo|investimento).*"))return null;
        if(!n.matches("(?s).*(?:\\bcompra\\b|comprou|\\bpagamento\\b|\\btransacao\\b|\\btransação\\b|cartao utilizado|cartao usado|cartao de credito|voce pagou|aprovad).*"))return null;
        Matcher amount=VALUE.matcher(joined);if(!amount.find())return null;
        long cents;try{cents=Math.round(Double.parseDouble(amount.group(1).replace(".","").replace(",","."))*100.0);}catch(Exception e){return null;}
        if(cents<=0||cents>100000000L)return null;
        String merchant="";
        Matcher m=MERCHANT.matcher(joined);
        while(m.find()){
            String raw=m.group(1).replaceAll("(?i)\\s+(?:com cart[aã]o|cart[aã]o|final|terminad[oa]|de r\\$|no valor|valor|às? \\d{1,2}:\\d{2}).*$","").trim();
            if(raw.length()>1&&!normalize(raw).matches("^(?:r\\$|credito|debito|compra|cartao|aprovada|pagamento|transacao|reais|seu|sua|voce)$")){
                merchant=raw;break;
            }
        }
        boolean review=merchant.isEmpty()||merchant.length()>65;
        if(review)merchant="Compra Samsung Wallet (conferir)";
        return new Purchase(Instant.ofEpochMilli(time).atZone(ZoneId.systemDefault()).toLocalDate().format(DAY),merchant,cents,review);
    }
    private WalletPurchaseParser(){}
}
