'use client'
import { useState } from 'react'

type Question = {
  id: string
  question: string
  placeholder: string
  helper?: string
}

const QUESTIONS: Question[] = [
  {
    id: 'what_it_does',
    question: "En une phrase, qu'est-ce que ton produit permet à quelqu'un de faire ou d'obtenir ?",
    placeholder: "Ex: Apprendre à créer des publicités Facebook qui ramènent des clients",
    helper: "Sois concret, pas vague.",
  },
  {
    id: 'ideal_client',
    question: "Qui est ton client idéal ?",
    placeholder: "Ex: Entrepreneurs africains 25-40 ans qui vendent en ligne mais galèrent à trouver des clients",
    helper: "Âge, situation, ce qu'il fait dans la vie.",
  },
  {
    id: 'main_problem',
    question: "Quel est le problème numéro 1 que vit ton client avant d'acheter ton produit ?",
    placeholder: "Ex: Il poste sur les réseaux mais personne n'achète, il ne sait pas pourquoi",
  },
  {
    id: 'transformation',
    question: "Qu'est-ce qui change concrètement dans sa vie une fois qu'il a utilisé ton produit ?",
    placeholder: "Ex: Il sait créer des publicités qui ramènent 5 à 10 clients par semaine",
  },
  {
    id: 'results',
    question: "As-tu déjà eu des résultats avec ce produit, toi-même ou tes clients ?",
    placeholder: "Ex: J'ai aidé 50 entrepreneurs à doubler leurs ventes en 1 mois",
    helper: "Si oui, donne des chiffres ou exemples. Si non, laisse vide.",
  },
  {
    id: 'differentiator',
    question: "Qu'est-ce qui rend ton produit différent des autres solutions qui existent ?",
    placeholder: "Ex: Contrairement aux formations généralistes, c'est 100% adapté au contexte africain",
  },
  {
    id: 'guarantee',
    question: "Offres-tu une garantie ou un engagement particulier ?",
    placeholder: "Ex: Satisfait ou remboursé sous 7 jours",
    helper: "Optionnel mais recommandé.",
  },
]

type QuestionFlowProps = {
  onComplete: (rawContent: string) => void
  onCancel: () => void
}

export default function QuestionFlow({ onComplete, onCancel }: QuestionFlowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentAnswer, setCurrentAnswer] = useState('')

  const currentQuestion = QUESTIONS[currentIndex]
  const isLast = currentIndex === QUESTIONS.length - 1
  const progress = ((currentIndex + 1) / QUESTIONS.length) * 100

  const buildRawContent = (finalAnswers: Record<string, string>) => {
    const parts: string[] = []
    if (finalAnswers.what_it_does) parts.push(`Ce que le produit permet : ${finalAnswers.what_it_does}`)
    if (finalAnswers.ideal_client) parts.push(`Client idéal : ${finalAnswers.ideal_client}`)
    if (finalAnswers.main_problem) parts.push(`Problème principal : ${finalAnswers.main_problem}`)
    if (finalAnswers.transformation) parts.push(`Transformation après usage : ${finalAnswers.transformation}`)
    if (finalAnswers.results) parts.push(`Résultats obtenus : ${finalAnswers.results}`)
    if (finalAnswers.differentiator) parts.push(`Différenciation : ${finalAnswers.differentiator}`)
    if (finalAnswers.guarantee) parts.push(`Garantie : ${finalAnswers.guarantee}`)
    return parts.join('\n\n')
  }

  const handleNext = () => {
    const updatedAnswers = { ...answers, [currentQuestion.id]: currentAnswer.trim() }
    setAnswers(updatedAnswers)

    if (isLast) {
      onComplete(buildRawContent(updatedAnswers))
      return
    }

    setCurrentIndex(currentIndex + 1)
    setCurrentAnswer(updatedAnswers[QUESTIONS[currentIndex + 1]?.id] || '')
  }

  const handlePrevious = () => {
    if (currentIndex === 0) return
    const updatedAnswers = { ...answers, [currentQuestion.id]: currentAnswer.trim() }
    setAnswers(updatedAnswers)
    setCurrentIndex(currentIndex - 1)
    setCurrentAnswer(answers[QUESTIONS[currentIndex - 1].id] || '')
  }

  const isOptional = currentQuestion.id === 'results' || currentQuestion.id === 'guarantee'
  const canProceed = isOptional || currentAnswer.trim().length > 0

  const inputStyle = {
    width: '100%',
    background: '#1A1A1A',
    color: '#fff',
    borderRadius: '10px',
    padding: '16px',
    border: '0.5px solid #2a2a2a',
    outline: 'none',
    fontSize: '15px',
    lineHeight: '1.6',
    boxSizing: 'border-box' as const,
    resize: 'vertical' as const,
  }

  return (
    <div style={{ background: '#111111', borderRadius: '14px', border: '0.5px solid #1F1F1F', overflow: 'hidden' }}>
      {/* PROGRESS BAR */}
      <div style={{ height: '3px', background: '#1F1F1F', position: 'relative' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: '#10B981', transition: 'width 0.3s ease' }} />
      </div>

      <div style={{ padding: '32px 28px' }}>
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <span style={{ fontSize: '12px', color: '#10B981', fontWeight: '700', letterSpacing: '1px' }}>
            QUESTION {currentIndex + 1} SUR {QUESTIONS.length}
          </span>
          <button onClick={onCancel} style={{ background: 'transparent', border: 'none', color: '#6B7280', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}>
            Annuler
          </button>
        </div>

        {/* QUESTION */}
        <div
          key={currentQuestion.id}
          style={{
            animation: 'fadeInQ 0.4s ease',
          }}
        >
          <style>{`
            @keyframes fadeInQ {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          <h3 style={{ fontSize: '19px', fontWeight: '700', color: '#fff', margin: '0 0 8px', lineHeight: '1.4' }}>
            {currentQuestion.question}
            {isOptional && <span style={{ color: '#6B7280', fontWeight: '400', fontSize: '14px' }}> (optionnel)</span>}
          </h3>
          {currentQuestion.helper && (
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 16px' }}>{currentQuestion.helper}</p>
          )}

          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder={currentQuestion.placeholder}
            rows={4}
            style={{ ...inputStyle, marginTop: currentQuestion.helper ? 0 : '12px' }}
            autoFocus
          />
        </div>

        {/* NAVIGATION */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          {currentIndex > 0 && (
            <button
              onClick={handlePrevious}
              style={{ background: 'transparent', border: '0.5px solid #2a2a2a', color: '#9CA3AF', fontSize: '14px', padding: '12px 20px', borderRadius: '8px', cursor: 'pointer' }}
            >
              ← Précédent
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed}
            style={{
              flex: 1,
              background: canProceed ? '#10B981' : '#1A1A1A',
              border: 'none',
              color: canProceed ? '#000' : '#444',
              fontSize: '14px',
              fontWeight: '700',
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: canProceed ? 'pointer' : 'not-allowed',
            }}
          >
            {isLast ? 'Terminer →' : 'Suivant →'}
          </button>
        </div>
      </div>
    </div>
  )
}