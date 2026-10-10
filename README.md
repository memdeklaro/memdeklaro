# Memdeklaro Self-Declaration of Identity

Memdeklaro is a privacy-first client-side web app for decentralized and self-asserted identity.

Memdeklaro allows users to generate and customize a **self-declaration of identity** in their browser, and export it as a template for printing (e.g. as a business card), digital usage (e.g. as a PDF file) or as a self-asserted verifiable credential for digital and web3 wallets.

Self-declaration provides a way for people to express a self-chosen name and personal ties without requiring permission from a centralized third party. It can be used as a universally accessible foundation to build connections and reputation in peer-to-peer networks and communities, online and in person.

The official Memdeklaro project website is available at [https://memdeklaro.org](https://memdeklaro.org)

## Benefits

- **Free to use**: No account, subscription or payment is required
- **Accessible**: No government ID or third party permission is required
- **Empowering**: Define your identity on your own terms and choose a name that fits you
- **Extensible**: Use your self-declaration as a basis for building a reputation, portfolio or community network
- **Privacy friendly**: Data is never sent to a server, database, blockchain, IPFS storage or registry
- **Forkable**: Fork it and make your own design or implementation

## How to Use

1\. Fill out the self-declaration form with the following info:

- Self-chosen first name
- Self-chosen surname
- Date of birth
- Photograph
- Signature
- Optional personal note (e.g. Conscientious Objector)

2\. Click on the Generate button

3\. Your self-declaration is immediately available to download in the following formats:

- A self-declaration card that you can print or use digitally - `memdeklaro_front.jpg` and `memdeklaro_back.jpg`
- A JSON-LD verifiable credential that you can self-sign with your DID key as a self-attested verifiable credential
- A PDF that includes your self-declaration in graphical format and as a QR code

The generator is fully client-side and never sends any data to a server.

Alternatively, you can open the files `/app/template_front.jpg` and `/app/template_back.jpg` in any image editor such as Photoshop or GIMP and add your details manually, without using the generator.

## Self Hosting

1. Download `/downloads/app.zip` and extract the standalone generator
2. For offline usage: Run a local HTTP server on localhost and navigate to `http://127.0.0.1:8080/index.html`
3. For online usage: Upload to a static website host like Github Pages, to shared hosting, or to your VPS

## Included Files

- index.html - Website landing page with embedded generator widget
- about.html - Frequently asked questions
- /app/ - The generator (form, images and JavaScript)
- /img/ - Images including logos and two example/demo self-declarations
- /blog/decentralized-identity-guide.html - An overview of decentralized identity (DID) and self-sovereign identity (SSI) technology
- /blog/non-government-id-guide.html - The history of non-government ID including the Nansen Passport, World Passport, Digitalcourage ID and Bitnation
- /downloads/app.zip - A standalone generator for self-hosting, offline usage or forking
- /downloads/whitepaper.pdf - Memdeklaro whitepaper
- /downloads/working_paper.pdf - Memdeklaro working paper
- /downloads/technical_specification.pdf - Memdeklaro technical specification

## Forking

If you want to fork only the generator, extract `/downloads/app.zip`.

If you want to fork only the template, extract `/app/template_front.jpg` and `/app/template_back.jpg`.

Memdeklaro is in the public domain and forks are permitted. However the Memdeklaro project (at Memdeklaro.org) does not endorse any specific forks and is not partnered with any forks.

## License

Public Domain / CC0 Universal / Unlicense

## Tags

Decentralized Identity, Self-Sovereign Identity, JavaScript, HTML5 Canvas

## Version

Version 2 - October 2026
