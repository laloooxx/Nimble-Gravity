import type { Candidate } from "../types/candidates";

async function getCandidate(): Promise<Candidate> 
{
    const url = import.meta.env.VITE_URL_CANDIDATO;
    if (!url) throw new Error('URL de candidato no definida en las variables de entorno');

    const response = await fetch(url);
    if (!response.ok) throw new Error('Falla en encontrar el candidato');
    
    const data = await response.json();
    return {
        uuid: data.uuid,
        candidateId: data.candidateId,
        applicationId: data.applicationId,
    };
}

export { getCandidate };