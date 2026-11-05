export const initialProgress = () => ({ schema: 1, responses: [], attempts: [], completedLessons: [], bookmarks: [], discursive: {}, minutes: 0, settings: { theme: 'light', session: 45 }, revisionDates: {}, studySessions: [] });
/** Apenas questões completas com resolução revisada podem gerar respostas e avaliações.
 * O registro de um gabarito oficial, isoladamente, não valida o enunciado.
 */
export const eligible = (q) => q.status === 'resolucao-independente-revisada' && !q.needsSource &&
    q.choices.length === 5 && q.choices.every(c => Boolean(c.trim()) && !/consulte o pdf|consulte o caderno/i.test(c)) &&
    !/abra o caderno oficial|consulte o pdf|texto não foi copiado/i.test(q.prompt);
export const score = (answers, questions) => ({ total: questions.length, answered: questions.filter(q => answers[q.id] !== undefined).length, correct: questions.filter(q => answers[q.id] === q.answer).length });
export const daysUntil = (date, now = new Date()) => Math.max(0, Math.ceil((new Date(`${date}T00:00:00-03:00`).getTime() - now.getTime()) / 86400000));
export function pickAdaptive(questions, responses, count) {
    const records = new Map();
    for (const r of responses) {
        records.set(r.questionId, [...(records.get(r.questionId) || []), r]);
    }
    const areaUsed = new Map();
    const results = [];
    const candidates = questions.filter(eligible).sort((a, b) => a.id.localeCompare(b.id));
    while (results.length < count && candidates.length) {
        let winner = 0, best = -Infinity;
        for (let i = 0; i < candidates.length; i++) {
            const q = candidates[i], hist = records.get(q.id) || [], miss = hist.filter(x => !x.correct).length, last = hist[hist.length - 1];
            const priority = (hist.length === 0 ? 8 : 0) + (last && !last.correct ? 12 : 0) + miss * 2 - hist.length * 1.5 - (areaUsed.get(q.areaId) || 0) * 5 + (q.difficulty === 'Média' ? 1 : 0);
            if (priority > best) {
                best = priority;
                winner = i;
            }
        }
        const q = candidates.splice(winner, 1)[0];
        results.push(q);
        areaUsed.set(q.areaId, (areaUsed.get(q.areaId) || 0) + 1);
    }
    return results;
}
