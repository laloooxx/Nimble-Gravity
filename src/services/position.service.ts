import type { Position } from "../types/position";

async function getPositions(): Promise<Position[]> 
{
    const url = import.meta.env.VITE_URL_POSICIONES;
    if (!url) throw new Error('URL de posiciones no definida en las variables de entorno');

    const response = await fetch(url);
    if (!response.ok) throw new Error('Falla en encontrar las posiciones');
    
    const data = await response.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((item: any) => ({
        id: item.id,
        title: item.title,
    }));
}

async function sendPosition(jobId: string, repoUrl: string, uuid: string, candidateId: string, applicationId: string): Promise<void>
{
    const url = import.meta.env.VITE_URL_PUESTO;
    if (!url) throw new Error('URL de aplicación a puesto no definida en las variables de entorno');

    const body = { uuid, jobId, candidateId, repoUrl, applicationId };
    const response = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type' : 'application/json' },
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        const errorText = await response.text();
        console.error('Respuesta de la API:', errorText);
        throw new Error('Falla al enviar la postulacion');
    }
}

export { getPositions, sendPosition };