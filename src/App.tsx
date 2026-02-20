import { useState, useEffect } from 'react'
import './App.css'
import type { Position } from './types/position';
import { getPositions, sendPosition } from './services/position.service';
import type { Candidate } from './types/candidates';
import { getCandidate } from './services/candidate.service';

function App() {
  const [positions, setPositions] = useState<Position[]>([])
  const [candidates, setCandidates] = useState<Candidate | null>(null);
  const [repoUrls, setRepoUrls] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
// eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    Promise.all([getPositions(), getCandidate()])
      .then(([positionsData, candidatesData]) => {
        setPositions(positionsData);
        setCandidates(candidatesData);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError('No se pudieron los datos. Intenta recargar la página.');
      })
        .finally(() => setLoading(false));
  }, [])

  const handleRepoUrlChange = (positionId: string, url: string) => {
    setRepoUrls((prevRepoUrls) => ({
      ...prevRepoUrls,
      [positionId]: url,
    }));
  }
  const handleSubmit = async (positionId: string) => {
    const repoUrl = repoUrls[positionId]?.trim();
    if (!repoUrl) {
      alert('Colocar un URL de repositorio válido antes de enviar.');
      return;
    }
    if (!candidates) {
      alert('No se han cargado los datos del candidato. Intenta recargar la página.');
      return;
    }

    try {
      await sendPosition(positionId, repoUrl, candidates.uuid, candidates.candidateId, candidates.applicationId);
      alert('Postulacion enviada con éxito!');
    } catch (error) {
      console.error(error);
      alert('Error al enviar la postulación. Intenta nuevamente.');
    }
  }

  if (loading) return <p>Cargando posiciones...</p>;
  if (error) return <p>{error}</p>;
  return (
    <>
      <section className='positions-grid'>
        {positions.map((position) => (
          <article key={position.id} className='position-card'>
            <h2>{position.title}</h2>
            <input
              type="url"
              placeholder='https://github.com/tu-usuario/tu-repo'
              value={repoUrls[position.id] ?? ''}
              onChange={(e) => handleRepoUrlChange(position.id, e.target.value)}
            />
            <button type='button' onClick={() => handleSubmit(position.id)}>Submit</button>
          </article>
        ))}
      </section>
    </>
  )
}

export default App
