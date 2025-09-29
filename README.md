# DANAMEME

✨ *A meme-sharing platform built at the Swiss Post ICT Campus for students and apprentices.*

---

## About DANAMEME

DANAMEME started as a fun side project to give students and apprentices at the ICT Campus of Swiss Post a place to share and enjoy IT & campus-related memes.

I (Levyn) built the first version as a quick prototype. Since then, it has grown into a more polished second version that future campus generations can continue to use.

While DANAMEME is source-available for learning and inspiration, it is not an open source project. The code can be read and adapted locally, but it may not be used for commercial purposes or redistributed as a separate product.

---

## Tech Highlights

**Frontend**

* [Next.js](https://nextjs.org/)
* [React](https://react.dev/)
* [Tailwind CSS](https://tailwindcss.com/)

**Backend & Database**

* Next.js Route Handlers (API routes)
* [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/)

**Infrastructure & Tools**

* [Azure](https://azure.microsoft.com/) (Blob storage)
* [Imgix](https://www.imgix.com/) (CDN for images)
* [Terraform](https://www.terraform.io/) (Infrastructure as Code)
* [Vercel](https://vercel.com/) (Hosting)
* [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database) (Cloud DB)
* [Mailgun](https://www.mailgun.com/) (Email API)
* [Infomaniak](https://www.infomaniak.com/) (Domain)
* [MongoDB Compass](https://www.mongodb.com/products/tools/compass) (GUI for MongoDB)

---

## Developer Notes

If you’d like to explore DANAMEME locally, you can:

```bash
# Clone the repo
git clone https://github.com/ly-schneider/danameme
cd danameme

# Install dependencies
npm install
```

Then create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/danameme
JWT_SECRET=your-secret-key
NEXT_PUBLIC_API_URL=http://localhost:3000/api
AZURE_CONNECTION_STRING=your-azure-storage-connection-string
IMAGE_URL=your-storage-account-name.blob.core.windows.net
MAILGUN_API_KEY=
MAILGUN_DOMAIN=
```

Run the development server:

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

> 💡 *Tip*: Terraform scripts are included to provision Azure Storage Accounts. Run `terraform init && terraform apply` in the `terraform` directory to set them up.

---

## Why It Matters

DANAMEME isn’t just a meme site — it’s an example of how to:

* Build a **full-stack web app** from scratch.
* Integrate **cloud services (Azure, Vercel, MongoDB Atlas)**.
* Use **Infrastructure as Code (Terraform)** for repeatable deployments.
* Balance **fun, community-driven use cases** with modern web development practices.