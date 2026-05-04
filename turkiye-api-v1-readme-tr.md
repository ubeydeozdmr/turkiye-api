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

## v2 önizlemesi yayınlandı

TurkiyeAPI sürüm 2'nin önizlemesi kamuya açık olarak yayınlandı! Tam sürüm Haziran ayında olacak, ancak bu arada v2'yi kullanabilir ve geri bildirimde bulunabilirsiniz.

Tabii ki, hala v1'i kullanabilirsiniz, ancak birçok yeni özelliği ve iyileştirmesi olduğu için v2'yi kullanmanızı öneririm. v2 için dokümantasyon ve Postman koleksiyonunu aşağıdaki bağlantılarda bulabilirsiniz. Ayrıca geri bildiriminiz v2'nin gelişimi için çok önemlidir, bu yüzden lütfen aşağıdaki bağlantıları kullanarak geri bildirimde bulunmaktan çekinmeyin.

v2'deki yenilikler:

- **Belediye Birimleri**: v2'de belediye birimleri kavramı tanıtıldı. Bu, iller, ilçeler, mahalleler ve köylere ek olarak artık belediye birimlerinin de bulunduğu anlamına gelir. Bu, daha detaylı ve doğru veri sunumuna olanak tanır. Daha önce v1'de bir yama olarak dahil edilen beldeler kaldırıldı ve v2'de belediye birimleriyle değiştirildi. Bu değişiklik, Türkiye'deki idari bölünmelerin daha kapsamlı ve doğru bir şekilde temsil edilmesini sağlar.
- **Güncellenmiş Veri**: v2'deki veriler, mevcut en son bilgileri yansıtacak şekilde güncellendi. Bu, nüfus değişikliklerini ve yeni idari bölünmeleri içerir.
- **İyileştirilmiş Performans**: API'nin performansı v2'de iyileştirildi, daha hızlı yanıt süreleri ve büyük veri setlerinin daha iyi işlenmesini sağlar.
- **Yeni Uç Noktalar**: v2'de daha spesifik veriler sağlamak ve daha karmaşık sorgulara izin vermek için yeni uç noktalar eklendi.
- **Posta Kodları**: Posta kodu özelliği v2'de il ve ilçelere ek olarak mahalle ve köyleri de içerecek şekilde genişletildi. Bu, posta kodlarına dayalı daha detaylı filtreleme ve veri alımına olanak tanır.

Temel v2 URL: `https://api.turkiyeapi.dev/v2`

[v2 için Dokümantasyon](https://github.com/ubeydeozdmr/turkiye-api/tree/v2#readme)

[v2 için Postman Koleksiyonu](https://documenter.getpostman.com/view/19561492/UzBguVHM)

[v2 için geri bildirim sağlayın (GitHub Issues)](https://github.com/ubeydeozdmr/turkiye-api/issues/58#issuecomment-4358464318)

[v2 için geri bildirim sağlayın (E-posta)](mailto:ubeydeozdmr@gmail.com)

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
