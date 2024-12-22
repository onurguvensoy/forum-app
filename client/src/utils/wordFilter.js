export function filterAllWords(metin) {
    const kotuKelimeler = [
        "k�f�r1",
        "k�f�r1ler",
        "kufur1",
        "k�f*r1",
        "k�f�r2",
        "k�f�r3"
    ];
    const yasakliKombinasyonlar = [
        "k�t� kombinasyon1",
        "k�t� kombinasyon2"
    ];

    const tekrarlayanKelimeDeseni = /\b(\w+)\b(?:\s+\1\b)+/gi; // Tekrarlayan kelimeler
    const tekrarlayanKarakterDeseni = /(.)\1{2,}/g; // 3 veya daha fazla tekrar eden karakterler

    // Yasakl� kelime ve kombinasyonlar� * ile sans�rle
    const regex = new RegExp([...kotuKelimeler, ...yasakliKombinasyonlar].join("|"), "gi");
    let sansurluMetin = metin.replace(regex, (eslesme) => "*****".repeat(eslesme.length));

    // Tekrarlayan kelimeleri kald�r
    sansurluMetin = sansurluMetin.replace(tekrarlayanKelimeDeseni, (match) => match.split(/\s+/)[0]);

    // Tekrarlayan karakterleri * ile de�i�tir
    sansurluMetin = sansurluMetin.replace(tekrarlayanKarakterDeseni, "*****");

    return sansurluMetin;
}

// Minimum karakter s�n�r� kontrol fonksiyonu
export function hasMinimumChars(metin, minKarakterSayisi) {
    return metin.trim().length >= minKarakterSayisi;
}

// Maksimum karakter s�n�r� kontrol fonksiyonu
export function hasExceededCharLimit(metin, maxKarakterSayisi) {
    return metin.trim().length > maxKarakterSayisi;
}
