import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the JSON file instead of YAML
const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, 'swagger.json'), 'utf8'));

const swaggerUiSetup = swaggerUi.setup(swaggerDocument, {
  explorer: true,
  customCss: `
    .swagger-ui .topbar {
      background-color: #EBF7F3 !important;  /* Green background */
    }
    .swagger-ui .topbar-wrapper img,
    .swagger-ui .topbar-wrapper .link span,
    .swagger-ui .topbar-wrapper .link svg {
      display: none !important;
    }
    .swagger-ui .topbar-wrapper .link:before {
      content: '';
      display: inline-block;
      background-image: url('/public/logo.png'); /* Your local logo path */
      background-size: contain;
      background-repeat: no-repeat;
      width: 100px;
      height: 100px;
      margin-left: 10px;
    }
  `
});

export { swaggerUi, swaggerDocument, swaggerUiSetup };
