# Turkiye API

TurkiyeAPI, Türkiye'nin illeri, ilçeleri, mahalleler ve köyler hakkında detaylı bilgiler sunan demografik ve coğrafi verilerle kapsamlı bir REST API'sidir.

API ana alan adı olarak [turkiyeapi.dev](https://turkiyeapi.dev) kullanır. Ziyaret edebilirsiniz: [https://turkiyeapi.dev](https://turkiyeapi.dev)

## Kaynaklar

- [İlçelerin nüfusu](https://biruni.tuik.gov.tr/medas)
- [İlçelerin alanı](https://web.archive.org/web/20190416051733/https://www.harita.gov.tr/images/urun/il_ilce_alanlari.pdf)

## Dokümantasyon

- [API Dokümantasyonu](https://api.turkiyeapi.dev/docs)
- [Örnekler](https://api.turkiyeapi.dev/examples)
- [Postman Koleksiyonu](https://documenter.getpostman.com/view/19561492/UzBguVHM)
- [Swagger UI](https://api.turkiyeapi.dev/swagger)

## Python Uygulaması

TurkiyeAPI v1'in Python uygulamasına [@gencharitaci/turkiye-api-py](https://github.com/gencharitaci/turkiye-api-py) adresinden ulaşılabilir.

## TurkiyeAPI v2 yayınlandı

v1'den geçiş detayları için [v1'den v2'ye Geçiş](https://docs.turkiyeapi.dev/tr/v2/guide/migration-from-v1.html) sayfasına bakabilirsiniz.

### Eklenenler

- `/v2` API prefix'i eklendi.
- `data` ve `meta` alanlarını kullanan metadata zengin yanıt envelope yapıları eklendi.
- Sabit `error.code`, `error.message` ve `error.status` alanlarını kullanan yapılandırılmış hata yanıtları eklendi.
- `include` ve nested collection route'larıyla ilişkili verilerin açıkça yüklenmesi eklendi.
- İl merkezi, ilçe merkezi ve belde belediyesi tiplerini kapsayan birinci sınıf `municipalities` kaynakları eklendi.
- `/v2/datasets` altında statik JSON veri seti indirmeleri eklendi.
- `/v2/datasets/2025/provinces.json` gibi sürümlü veri seti indirmeleri eklendi.
- API, veri seti, kaynak ve kayıt sayısı metadata bilgileri için `/v2/meta` eklendi.
- `/v2/openapi.json` üzerinden OpenAPI 3.1 çıktısı eklendi.
- Mahalle ve köy liste endpoint'leri için posta kodu filtreleri eklendi.

### Değişenler

- Liste sayfalaması `limit`, `offset`, `meta.count` ve `meta.total` ile standart hale getirildi.
- Arama davranışı `search` sorgu parametresi etrafında standart hale getirildi.
- Üst kaynak ad filtreleri ID filtreleri ve nested route'larla değiştirildi.
- İlişkili kaynaklar varsayılan olarak gömülmek yerine isteğe bağlı hale getirildi.
- Sorgu parametresi, alan seçimi, hiyerarşi ve aralık validasyonları sıkılaştırıldı.
- `area` ve `altitude` gibi sayısal ölçüm alanları `value` ve `unit` içeren yapılandırılmış objelere taşındı.
- `areaCode` yerine `phoneAreaCodes` kullanılmaya başlandı.
- Posta kodları yalnızca mahalle ve köy kayıtlarında `postalCode` ve `postalCodeStatus` alanlarıyla modellendi.

### Kaldırılanlar

- v2'de eski `/api/v1` prefix desteği kaldırıldı.
- Başarılı yanıtlardaki üst seviye `status` alanı kaldırıldı.
- `extend=true` kaldırıldı; bunun yerine `include` veya nested route kullanılmalıdır.
- `/towns` kaldırıldı; belde belediyeleri için `/v2/municipalities?type=town` kullanılmalıdır.
- `activatePostalCodes` kaldırıldı; posta kodu alanları desteklenen kaynaklarda doğrudan döner.

Temel v2 URL: `https://api.turkiyeapi.dev/v2`

[v2 GitHub Kaynak Kodu](https://github.com/ubeydeozdmr/turkiye-api/tree/v2)

[v2 için Dokümantasyon (Rehber)](https://docs.turkiyeapi.dev/tr/v2/guide/)

[v2 için Dokümantasyon (API Referansı)](https://docs.turkiyeapi.dev/tr/v2/api-reference/)

[v2 için Postman Koleksiyonu](https://documenter.getpostman.com/view/19561492/UzBguVHM)

[v2 için geri bildirim sağlayın (GitHub Issues)](https://github.com/ubeydeozdmr/turkiye-api/issues/58#issuecomment-4358464318)

[v2 için geri bildirim sağlayın (E-posta)](mailto:ubeydeozdmr@gmail.com)

## Eski v1

v1 sürümü hala kullanılabilir durumdadır ve bir süre daha kullanılmaya devam edecektir. Ancak, yeni özellikler veya güncellemeler almayacak ve gelecekte muhtemelen kullanımdan kaldırılacaktır. Bu nedenle, yeni projeler için API'nin v2 sürümünü kullanmanız önerilir.

## API Kullanımı

## İller

### Tüm İlleri Getir

**Uç Nokta:** `GET /v1/provinces`

Tüm iller için veri almak için bu rotayı kullanabilirsiniz. Kullanılabilir sorgu parametreleri:

- `name` (string): Arama sorgunuzu içeren veya eşleşen tüm illeri gösterir.
- `minPopulation` (number): Girdiğiniz değere eşit veya daha fazla nüfusa sahip tüm illeri gösterir.
- `maxPopulation` (number): Girdiğiniz değere eşit veya daha az nüfusa sahip tüm illeri gösterir.
- `minArea` (number): Girdiğiniz değere eşit veya daha fazla alana sahip tüm illeri gösterir.
- `maxArea` (number): Girdiğiniz değere eşit veya daha az alana sahip tüm illeri gösterir.
- `minAltitude` (number): Girdiğiniz değere eşit veya daha fazla irtifaya sahip tüm illeri gösterir.
- `maxAltitude` (number): Girdiğiniz değere eşit veya daha az irtifaya sahip tüm illeri gösterir.
- `isCoastal` (boolean): Kıyı olan veya olmayan tüm illeri gösterir.
- `isMetropolitan` (boolean): Büyükşehir olan veya olmayan tüm illeri gösterir.
- `offset` (number): Sayfalama için kullanılır. Arama sonuçlarında bir başlangıç noktası belirlemek için bunu kullanın.
- `limit` (number): Sayfalama için kullanılır. Gösterilecek maksimum sonuç sayısını belirlemek için bunu kullanın.
- `fields` (string): Yanıtta görmek istediğiniz alanları gösterir.
- `sort` (string): Sonuçları artan veya azalan sırada sıralar.

### Belirli Bir İli Getir

**Uç Nokta:** `GET /v1/provinces/:id`

Belirli bir il için veri almak için bu rotayı kullanabilirsiniz. Kullanılabilir yol değişkenleri ve sorgu parametreleri:

- `id` (Yol Değişkeni): İlin ID'si
- `fields` (Sorgu Parametresi, string): Yanıtta görmek istediğiniz alanları gösterir.
- `extend` (Sorgu Parametresi, boolean): İlin genişletilmiş verilerini (mahalleler ve köyler) gösterir. [Varsayılan: false] (Bu deneysel bir özelliktir. Düzgün çalışmayabilir.)

## İlçeler

### Tüm İlçeleri Getir

**Uç Nokta:** `GET /v1/districts`

Tüm ilçeler için veri almak için bu rotayı kullanabilirsiniz. Kullanılabilir sorgu parametreleri:

- `name` (string): Arama sorgunuzu içeren veya eşleşen tüm ilçeleri gösterir.
- `minPopulation` (number): Girdiğiniz değere eşit veya daha fazla nüfusa sahip tüm ilçeleri gösterir.
- `maxPopulation` (number): Girdiğiniz değere eşit veya daha az nüfusa sahip tüm ilçeleri gösterir.
- `minArea` (number): Girdiğiniz değere eşit veya daha fazla alana sahip tüm ilçeleri gösterir.
- `maxArea` (number): Girdiğiniz değere eşit veya daha az alana sahip tüm ilçeleri gösterir.
- `provinceId` (number): Girdiğiniz ID'ye sahip ildeki tüm ilçeleri gösterir.
- `province` (string): Arama sorgunuzu içeren veya eşleşen ildeki tüm ilçeleri gösterir.
- `offset` (number): Sayfalama için kullanılır. Arama sonuçlarında bir başlangıç noktası belirlemek için bunu kullanın.
- `limit` (number): Sayfalama için kullanılır. Gösterilecek maksimum sonuç sayısını belirlemek için bunu kullanın.
- `fields` (string): Yanıtta görmek istediğiniz alanları gösterir.
- `sort` (string): Sonuçları artan veya azalan sırada sıralar.

### Belirli Bir İlçeyi Getir

**Uç Nokta:** `GET /v1/districts/:id`

Belirli bir ilçe için veri almak için bu rotayı kullanabilirsiniz. Kullanılabilir yol değişkenleri ve sorgu parametreleri:

- `id` (Yol Değişkeni): İlçenin ID'si
- `fields` (Sorgu Parametresi, string): Yanıtta görmek istediğiniz alanları gösterir.

## Mahalleler

### Tüm Mahalleleri Getir

**Uç Nokta:** `GET /v1/neighborhoods`

Tüm mahalleler için veri almak için bu rotayı kullanabilirsiniz. Kullanılabilir sorgu parametreleri:

- `name` (string): Arama sorgunuzu içeren veya eşleşen tüm mahalleleri gösterir.
- `minPopulation` (number): Girdiğiniz değere eşit veya daha fazla nüfusa sahip tüm mahalleleri gösterir.
- `maxPopulation` (number): Girdiğiniz değere eşit veya daha az nüfusa sahip tüm mahalleleri gösterir.
- `provinceId` (number): Girdiğiniz ID'ye sahip ildeki tüm mahalleleri gösterir.
- `province` (string): Arama sorgunuzu içeren veya eşleşen ildeki tüm mahalleleri gösterir.
- `districtId` (number): Girdiğiniz ID'ye sahip ilçedeki tüm mahalleleri gösterir.
- `district` (string): Arama sorgunuzu içeren veya eşleşen ilçedeki tüm mahalleleri gösterir.
- `offset` (number): Sayfalama için kullanılır. Arama sonuçlarında bir başlangıç noktası belirlemek için bunu kullanın.
- `limit` (number): Sayfalama için kullanılır. Gösterilecek maksimum sonuç sayısını belirlemek için bunu kullanın.
- `fields` (string): Yanıtta görmek istediğiniz alanları gösterir.
- `sort` (string): Sonuçları artan veya azalan sırada sıralar.

### Belirli Bir Mahalleyi Getir

**Uç Nokta:** `GET /v1/neighborhoods/:id`

Belirli bir mahalle için veri almak için bu rotayı kullanabilirsiniz. Kullanılabilir yol değişkenleri ve sorgu parametreleri:

- `id` (Yol Değişkeni): Mahallenin ID'si
- `fields` (Sorgu Parametresi, string): Yanıtta görmek istediğiniz alanları gösterir.

## Köyler

### Tüm Köyleri Getir

**Uç Nokta:** `GET /v1/villages`

Tüm köyler için veri almak için bu rotayı kullanabilirsiniz. Kullanılabilir sorgu parametreleri:

- `name` (string): Arama sorgunuzu içeren veya eşleşen tüm köyleri gösterir.
- `minPopulation` (number): Girdiğiniz değere eşit veya daha fazla nüfusa sahip tüm köyleri gösterir.
- `maxPopulation` (number): Girdiğiniz değere eşit veya daha az nüfusa sahip tüm köyleri gösterir.
- `provinceId` (number): Girdiğiniz ID'ye sahip ildeki tüm köyleri gösterir.
- `province` (string): Arama sorgunuzu içeren veya eşleşen ildeki tüm köyleri gösterir.
- `districtId` (number): Girdiğiniz ID'ye sahip ilçedeki tüm köyleri gösterir.
- `district` (string): Arama sorgunuzu içeren veya eşleşen ilçedeki tüm köyleri gösterir.
- `offset` (number): Sayfalama için kullanılır. Arama sonuçlarında bir başlangıç noktası belirlemek için bunu kullanın.
- `limit` (number): Sayfalama için kullanılır. Gösterilecek maksimum sonuç sayısını belirlemek için bunu kullanın.
- `fields` (string): Yanıtta görmek istediğiniz alanları gösterir.
- `sort` (string): Sonuçları artan veya azalan sırada sıralar.

### Belirli Bir Köyü Getir

**Uç Nokta:** `GET /v1/villages/:id`

Belirli bir köy için veri almak için bu rotayı kullanabilirsiniz. Kullanılabilir yol değişkenleri ve sorgu parametreleri:

- `id` (Yol Değişkeni): Köyün ID'si
- `fields` (Sorgu Parametresi, string): Yanıtta görmek istediğiniz alanları gösterir.

## Beldeler

Önemli Notlar:

- TurkiyeAPI'nin v1 sürümünün (belediye birimleri olmadan) kapsamı iller, ilçeler, mahalleler ve köyleri içermektir. Ancak, beldeler (bir tür belediye) ülkede önemli bir yere sahip olduğundan, mahalleler ve köyler gibi onlar için de iki rota tahsis edilmiştir. Kısacası, bu v1 için hazırlanmış bir yamadır. Ancak, mahalleler ve köylerin aksine, `/districts/:id` rotasında gösterilmezler, yani kendi içlerinde izole edilmişlerdir. Bununla birlikte, `/towns` ile başlayan bu rotalarda, beldelerin bağlı olduğu il-ilçe isimleri ve ID'leri belirtilir, yani isterseniz bunları kullanarak bağlantı kurabilirsiniz.

- Bu sadece bir yama güncellemesidir (Konu [#29](https://github.com/ubeydeozdmr/turkiye-api/issues/29)'a bakın), sürüm 2'de muhtemelen `/towns` rotasını kaldıracağım ve bunun yerine `/municipalities` rotasını ekleyeceğim.

### Tüm Beldeleri Getir

**Uç Nokta:** `GET /v1/towns`

Tüm beldeler için veri almak için bu rotayı kullanabilirsiniz. Kullanılabilir sorgu parametreleri:

- `name` (string): Arama sorgunuzu içeren veya eşleşen tüm beldeleri gösterir.
- `minPopulation` (number): Girdiğiniz değere eşit veya daha fazla nüfusa sahip tüm beldeleri gösterir.
- `maxPopulation` (number): Girdiğiniz değere eşit veya daha az nüfusa sahip tüm beldeleri gösterir.
- `provinceId` (number): Girdiğiniz ID'ye sahip ildeki tüm beldeleri gösterir.
- `province` (string): Arama sorgunuzu içeren veya eşleşen ildeki tüm beldeleri gösterir.
- `districtId` (number): Girdiğiniz ID'ye sahip ilçedeki tüm beldeleri gösterir.
- `district` (string): Arama sorgunuzu içeren veya eşleşen ilçedeki tüm beldeleri gösterir.
- `offset` (number): Sayfalama için kullanılır. Arama sonuçlarında bir başlangıç noktası belirlemek için bunu kullanın.
- `limit` (number): Sayfalama için kullanılır. Gösterilecek maksimum sonuç sayısını belirlemek için bunu kullanın.
- `fields` (string): Yanıtta görmek istediğiniz alanları gösterir.
- `sort` (string): Sonuçları artan veya azalan sırada sıralar.

### Belirli Bir Beldeyi Getir

**Uç Nokta:** `GET /v1/towns/:id`

Belirli bir belde için veri almak için bu rotayı kullanabilirsiniz. Kullanılabilir yol değişkenleri ve sorgu parametreleri:

- `id` (Yol Değişkeni): Beldenin ID'si
- `fields` (Sorgu Parametresi, string): Yanıtta görmek istediğiniz alanları gösterir.

## Posta Kodları Hakkında

Posta kodları özelliği şu anda kısmen eksiktir. Şu anda yalnızca iller ve ilçeler için posta kodu özelliği vardır ve mahalleler ve köyler için posta kodu özelliği daha sonra gelecektir. Ancak, bir diğer önemli nokta, posta kodu filtreleme yönteminin değiştirilebileceği, başka bir konuma taşınabileceği ve mahalle ve köy posta kodları eklendikten sonra il ve ilçeler için posta kodlarının kaldırılabileceğidir.

Bu rotalar için posta kodu özelliğini etkinleştirmek için aşağıdaki sorgu parametresini kullanabilirsiniz (true olarak ayarlamalısınız): Tüm İlleri Getir, Belirli Bir İli Getir, Tüm İlçeleri Getir, Belirli Bir İlçeyi Getir.

Öncelikle "activatePostalCodes" sorgu parametresini true olarak ayarlayarak posta kodu özelliğini etkinleştirmelisiniz.

### Posta Kodlarını Etkinleştir

- `activatePostalCodes` (boolean): Posta kodu özelliğini etkinleştirir. [Varsayılan: false]

Daha sonra illeri ve ilçeleri posta koduna göre filtrelemek için aşağıdaki sorgu parametrelerini kullanabilirsiniz:

- `postalCode` (string): Arama sorgunuzu içeren veya eşleşen tüm illeri/ilçeleri gösterir.

Posta kodları yalnızca rakamlardan oluşsa da, yine de string türündedir. Bunun nedeni, posta kodlarının sıfırla başlayabilmesidir.

## Lisans

[MIT](./LICENSE)

## Katkıda Bulunma

Pull request'ler memnuniyetle karşılanır. Büyük değişiklikler için, lütfen önce neyi değiştirmek istediğinizi tartışmak için bir konu açın.

<!-- ## Şablonlar

[Index](https://ubeydeozdmr.github.io/turkiye-api-templates/index.html)

[v1](https://ubeydeozdmr.github.io/turkiye-api-templates/v1/index.html) -->

## İletişim

Benimle [e-posta](mailto:ubeydeozdmr@gmail.com) veya [Telegram](https://t.me/ubeydeozdmr) aracılığıyla iletişime geçebilirsiniz.

## Destek

GitHub Sponsors ve Buy Me a Coffee, beni desteklemenin en iyi yollarıdır. Desteğiniz, sunucu masraflarını karşılamama ve API'yi geliştirmeye ve iyileştirmeye devam etmeme yardımcı olur.

<a href="https://www.buymeacoffee.com/ubeydeozdmr"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="buymeacoffee button" width="150" /></a>
