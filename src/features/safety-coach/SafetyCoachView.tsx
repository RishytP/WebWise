import { useMemo, useState, type ReactElement } from 'react';
import type { CookieReport, PageContext, PermissionReport } from '../../types';
import { SCENARIOS, contextualTips, isCorrectAnswer } from './scenarios';
import { Card, Pill } from '../../popup/components/Primitives';
import { IconBulb, IconCheck, IconCompass, IconInfo } from '../../popup/components/Icons';

interface Attempt {
  answerId: string;
  correct: boolean;
}

export function SafetyCoachView({
  context,
  cookieReport,
  permissionReport,
}: {
  context: PageContext;
  cookieReport: CookieReport | null;
  permissionReport: PermissionReport | null;
}): ReactElement {
  const [index, setIndex] = useState(0);
  const [attempts, setAttempts] = useState<Record<string, Attempt>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const scenario = SCENARIOS[index];
  const attempt = scenario ? attempts[scenario.id] : undefined;
  const isRevealed = scenario ? revealed[scenario.id] === true : false;

  const tips = useMemo(
    () =>
      contextualTips({
        cookieSummary:
          cookieReport && cookieReport.status === 'ok'
            ? {
                total: cookieReport.summary.total,
                httpOnly: cookieReport.summary.httpOnly,
                thirdParty: cookieReport.summary.thirdParty,
                persistent: cookieReport.summary.persistent,
              }
            : null,
        permissionFindings:
          permissionReport && permissionReport.status === 'ok'
            ? permissionReport.findings.map((f) => ({ name: f.name, state: f.state }))
            : null,
      }),
    [cookieReport, permissionReport],
  );

  if (!scenario) {
    return <p>No scenarios are available.</p>;
  }

  const choose = (answerId: string) => {
    if (attempt) return; // one attempt per scenario
    const correct = isCorrectAnswer(scenario, answerId);
    setAttempts((prev) => ({ ...prev, [scenario.id]: { answerId, correct } }));
    setRevealed((prev) => ({ ...prev, [scenario.id]: true }));
  };

  const tryAgain = () => {
    setAttempts((prev) => {
      const next = { ...prev };
      delete next[scenario.id];
      return next;
    });
    setRevealed((prev) => {
      const next = { ...prev };
      delete next[scenario.id];
      return next;
    });
  };

  const chosenAnswer = attempt ? scenario.answers.find((a) => a.id === attempt.answerId) : undefined;

  return (
    <div className="ww-stack">
      <Card
        title="Safety Coach"
        subtitle="Practise spotting tricky situations — nothing here visits a real site."
        icon={<IconCompass size={18} />}
        badge={`${index + 1} of ${SCENARIOS.length}`}
      >
        <div className="ww-coach__progress" role="tablist" aria-label="Scenarios">
          {SCENARIOS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Scenario ${i + 1}: ${s.title}`}
              className={`ww-coach__dot${i === index ? ' ww-coach__dot--current' : ''}${
                attempts[s.id] ? ' ww-coach__dot--done' : ''
              }`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>

        <h3 className="ww-card__title" style={{ fontSize: 14, marginBottom: 4 }}>
          {scenario.title}
        </h3>
        <p className="ww-perm__text">{scenario.intro}</p>

        <div className="ww-example">
          {scenario.example}
          {scenario.exampleDetail && <div className="ww-example__detail">{scenario.exampleDetail}</div>}
        </div>

        <p className="ww-strong" style={{ fontSize: 13, margin: '14px 0 8px' }}>
          {scenario.question}
        </p>

        <div role="group" aria-label="Answers">
          {scenario.answers.map((a) => {
            let cls = 'ww-answer';
            if (attempt) {
              if (a.id === attempt.answerId) {
                cls += a.correct ? ' ww-answer--correct' : ' ww-answer--wrong';
              } else if (a.correct && isRevealed) {
                cls += ' ww-answer--correct';
              }
            }
            return (
              <button
                key={a.id}
                type="button"
                className={cls}
                disabled={Boolean(attempt)}
                onClick={() => choose(a.id)}
              >
                {a.text}
              </button>
            );
          })}
        </div>

        {attempt && chosenAnswer && (
          <>
            <div className={`ww-feedback${attempt.correct ? ' ww-feedback--good' : ' ww-feedback--retry'}`}>
              <strong>{attempt.correct ? 'Nice — that is the safer choice. ' : 'Not quite. '}</strong>
              {chosenAnswer.feedback}
              {!attempt.correct && (
                <>
                  {' '}
                  <em>The safest option was: “{scenario.answers.find((a) => a.correct)?.text}”</em>
                </>
              )}
            </div>

            <div className="ww-takeaway">
              <span aria-hidden="true">
                <IconCheck size={18} />
              </span>
              <span>
                <strong>Takeaway: </strong>
                {scenario.takeaway}
              </span>
            </div>

            <div className="ww-row" style={{ marginTop: 12, gap: 8 }}>
              <button type="button" className="ww-btn" onClick={tryAgain}>
                Try this one again
              </button>
              {index < SCENARIOS.length - 1 && (
                <button type="button" className="ww-btn ww-btn--primary" onClick={() => setIndex(index + 1)}>
                  Next scenario
                </button>
              )}
            </div>
          </>
        )}
      </Card>

      <Card title="Tips for this page" subtitle={context.hostname ? `Based on what we found on ${context.hostname}` : 'General tips'} icon={<IconBulb size={18} />}>
        {tips.map((tip) => (
          <div className="ww-tip" key={tip.id}>
            <span aria-hidden="true" style={{ color: 'var(--ww-teal-600)', flexShrink: 0 }}>
              <IconInfo size={16} />
            </span>
            <div>
              <p className="ww-tip__title">{tip.title}</p>
              <p className="ww-tip__body">{tip.body}</p>
            </div>
          </div>
        ))}
      </Card>

      <Card title="A note about judging websites" icon={<IconInfo size={18} />}>
        <p className="ww-perm__text" style={{ marginBottom: 0 }}>
          WebWise will not label a site “safe” or “dangerous”. A site with no warnings today can still change, and a
          warning is a reason to look closer, not proof of harm. Check the address, think about what a page asks for,
          and ask a trusted adult whenever something feels off.
        </p>
      </Card>

      <p className="ww-footnote">
        <Pill tone="muted">Educational only</Pill> These scenarios are invented examples for practice.
      </p>
    </div>
  );
}
