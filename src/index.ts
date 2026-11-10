import { google } from "googleapis";
import { JWT } from "google-auth-library";
import type { Handler } from "aws-lambda";

export const handler: Handler = async (event, context) => {
    
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const credentialsJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

    if (!spreadsheetId || !credentialsJson) {
        throw new Error("Faltan variables de entorno");
    }

    const credentials = JSON.parse(credentialsJson);

    const auth = new JWT({
        email: credentials.client_email,
        key: credentials.private_key,
        scopes: [
            "https://www.googleapis.com/auth/spreadsheets",
        ],
    });

    const sheets = google.sheets({
        version: "v4",
        auth,
    });

    // Consultar registros
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "controles!A2:D",
    });

    const rows = response.data.values ?? [];

    console.log("Registros encontrados:", rows.length);

    // Aquí posteriormente generarás el reporte y lo subirás a S3.

    // Limpiar registros, conservando encabezados
    const clearResponse = await sheets.spreadsheets.values.clear({
        spreadsheetId,
        range: "controles!A2:D",
    });

    console.log("Registros eliminados:", clearResponse.status);

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Proceso ejecutado correctamente",
            totalRegistros: rows.length,
        }),
    };
};