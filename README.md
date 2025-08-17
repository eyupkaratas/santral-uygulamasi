# Santral Operasyon Uygulaması

Bu proje, bir kurumun veya belediyenin santral operasyonlarını yönetmek için geliştirilmiş tam teşekküllü bir web uygulamasıdır. Personel yönetimi, gelen çağrıların, kargoların, taleplerin ve randevuların kaydını tutma gibi işlevleri içerir.

## Özellikler

- **Kimlik Doğrulama:**  
  JWT tabanlı güvenli giriş sistemi ve rol bazlı yetkilendirme (Admin, Operator, DepartmentUser).

- **Personel ve Birim Yönetimi:**  
  Personel bilgilerini ve bağlı oldukları birimleri görüntüleme, ekleme, silme.

- **Talep (Ticket) Yönetimi:**  
  Vatandaşlardan veya personelden gelen talepleri oluşturma, personele atama ve durumunu (Açık/Kapalı) ve önceliğini (Düşük/Normal/Yüksek) takip etme. Talebin oluşturulduğu hesap otomatik olarak talebi oluşturan personel olarak atanır.

- **Kargo Takibi:**  
  Kuruma gelen kargoların kaydını tutma, ilgili personele atama ve teslim durumunu güncelleme.

- **Randevu Sistemi:**  
  Personel ve vatandaşlar arasında randevular oluşturma ve listeleme. Numara kaydı ile kaydedilen kişi, idsi ile randevuya atanabilir.

- **Çağrı Kaydı:**  
  Gelen ve giden aramaların kaydını tutma ve bu kayıtlar arasında arama yapma.

- **Karanlık/Aydınlık Mod:**  
  Kullanıcı tercihine göre tema değiştirme özelliği.

## Kullanılan Teknolojiler

### Backend

- ASP.NET Core 9
- Entity Framework Core
- SQLite

### Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui

## Projeyi Başlatma

### Yerel Kurulum (Windows)

Proje ana dizininde bulunan `start.bat` dosyası ile projeyi başlatabilirsiniz.

**Önemli:** `start.bat` dosyasına çift tıklayarak çalıştırın. Script, yönetici yetkileri isteyecek ve gerekli kontrolleri yapacaktır.

#### Script'in yapacağı işlemler:

- Yönetici yetkilerini kontrol eder ve gerekirse yeniden başlatır.
- Sistemde .NET SDK, Node.js (LTS) ve pnpm'in kurulu olup olmadığını kontrol eder. Eksik olanları `winget` aracılığıyla otomatik olarak kurar.
- Gerekli tüm backend ve frontend paketlerini (`dotnet restore` ve `pnpm install`) yükler.
- Backend ve frontend sunucularını ayrı pencerelerde başlatır.
- Otomatik olarak varsayılan tarayıcınızda uygulamayı açar ([http://localhost:3000](http://localhost:3000)).

**Önemli:** Kurulum sırasında hata almanız durumunda lütfen gerekli uygulamaları manuel olarak kurunuz.

## Proje Yapısı

Proje, iki ana bölümden oluşmaktadır:

- `/client`: Next.js ile geliştirilen frontend (kullanıcı arayüzü) kodlarını içerir.
- `/server`: ASP.NET Core ile geliştirilen backend (API) kodlarını içerir.
- 

## Varsayılan Giriş Bilgileri

Uygulamayı test etmek için aşağıdaki varsayılan kullanıcıları kullanabilirsiniz
. Bu kullanıcılar, veritabanı ilk oluşturulduğunda otomatik olarak eklenir.

**Varsayılan Şifre:** `123456`

### Admin Kullanıcısı

- E-posta: zeynep.kaya@belediye.gov.tr  
  Bu rol tüm yetkilere sahiptir.

### Operatör Kullanıcısı

- E-posta: ugurcan.tekin@belediye.gov.tr
  Bu rol kargo ve numara kaydı gibi temel santral operasyonlarını gerçekleştirebilir.

### Departman Kullanıcısı

- E-posta: deniz.ozturk@belediye.gov.tr  
  Bu rol, temel görüntüleme işlemlerini yapabilir ancak yönetimsel yetkilere sahip değildir.

