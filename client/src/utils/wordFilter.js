export function filterAllWords(metin) {
    const kotuKelimeler = [
        "küfür1",
        "küfür1ler",
        "kufur1",
        "küf*r1",
        "küfür2",
        "küfür3"
    ];
    const yasakliKombinasyonlar = [
        "kötü kombinasyon1",
        "kötü kombinasyon2"
    ];

    const tekrarlayanKelimeDeseni = /\b(\w+)\b(?:\s+\1\b)+/gi; // Tekrarlayan kelimeler
    const tekrarlayanKarakterDeseni = /(.)\1{2,}/g; // 3 veya daha fazla tekrar eden karakterler

    // Yasaklý kelime ve kombinasyonlarý * ile sansürle
    const regex = new RegExp([...kotuKelimeler, ...yasakliKombinasyonlar].join("|"), "gi");
    let sansurluMetin = metin.replace(regex, (eslesme) => "*****".repeat(eslesme.length));

    // Tekrarlayan kelimeleri kaldýr
    sansurluMetin = sansurluMetin.replace(tekrarlayanKelimeDeseni, (match) => match.split(/\s+/)[0]);

    // Tekrarlayan karakterleri * ile deðiþtir
    sansurluMetin = sansurluMetin.replace(tekrarlayanKarakterDeseni, "*****");

    return sansurluMetin;
}

// Minimum karakter sýnýrý kontrol fonksiyonu
export function hasMinimumChars(metin, minKarakterSayisi) {
    return metin.trim().length >= minKarakterSayisi;
}

// Maksimum karakter sýnýrý kontrol fonksiyonu
export function hasExceededCharLimit(metin, maxKarakterSayisi) {
    return metin.trim().length > maxKarakterSayisi;
}
