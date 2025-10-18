# Isomorphic - React.js Next.js Admin Dashboard (Helium Layout)

Bu proje [Turborepo](https://turbo.build/) ile güçlendirilmiş bir monorepo yapısındadır. Turborepo, monorepo projeleri için build sürelerini optimize eder.

## Sistem Gereksinimleri

- [Node.js 20.16.0](https://nodejs.org/en) veya üstü
- [Turborepo 2.1.1](https://turbo.build/repo/docs/getting-started/installation)
- [pnpm - package manager 9.9.0](https://pnpm.io/installation#using-npm) (önerilen)

## Kurulum

**Turborepo**: Hızlı kurulum için aşağıdaki komutu çalıştırın:

```bash
npm install -g turbo
```

## Geliştirme Sunucusunu Başlatma

Geliştirme sunucusunu yerel olarak başlatmak için:

```bash
pnpm install

pnpm run dev
```

Uygulama http://localhost:3002 adresinde çalışacaktır.

## Production Build

Production build oluşturmak ve başlatmak için:

```bash
pnpm run build

pnpm run start
```

## Proje Yapısı

```
tektas/
├── apps/
│   └── isomorphic-starter/     # Ana uygulama (Helium Layout)
├── packages/
│   ├── config-tailwind/        # Tailwind konfigürasyonu
│   ├── config-typescript/      # TypeScript konfigürasyonu
│   └── isomorphic-core/        # Ortak componentler
└── turbo.json                  # Turborepo konfigürasyonu
```

## Özellikler

- ✅ **Helium Layout**: Modern ve şık sidebar tasarımı
- ✅ **Next.js 15**: En yeni Next.js özellikleri
- ✅ **TypeScript**: Tip güvenli geliştirme
- ✅ **Tailwind CSS**: Utility-first CSS framework
- ✅ **Dark Mode**: Karanlık/Aydınlık tema desteği
- ✅ **Responsive**: Mobil uyumlu tasarım

## Daha Fazla Komut

Daha fazla komut için proje kök dizinindeki `package.json` dosyasına bakabilirsiniz.

Monorepo kök dizininde bulunan `turbo.json` dosyası ile özel görevler yapılandırabilir, global bağımlılıkları ayarlayabilir ve daha fazlasını yapabilirsiniz. [**Turborepo hakkında daha fazla bilgi**](https://turbo.build/repo/docs/handbook)

Happy coding! 🚀
