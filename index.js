import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const NETLIFY_TOKEN = "nfp_RFuD3Zmz6xoi7jjc45sPg95yCcVwTCxpadc7";
const NETLIFY_SITE_ID = "3d50b913-e744-4974-8baa-7c2f10f32094"; // <- já atualizado

app.post("/criar-checkout", async (req, res) => {
  const { nome, html } = req.body;

  if (!nome || !html) {
    return res.status(400).send("Faltam campos: nome e html");
  }

  try {
    const deployData = {
      files: {
        [`/${nome}/index.html`]: html
      }
    };

    const response = await fetch(
      `https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}/deploys`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NETLIFY_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(deployData)
      }
    );

    const json = await response.json();

    if (response.ok) {
      return res.json({
        message: "Checkout publicado com sucesso!",
        url: `${json.deploy_ssl_url}/${nome}/`
      });
    } else {
      return res.status(500).json({
        error: "Erro ao publicar no Netlify",
        details: json
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro interno ao subir checkout");
  }
});

app.listen(3000, () => {
  console.log("API rodando na porta 3000");
});
