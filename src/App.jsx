import React from 'react';
import SkillsBrowserView from './components/SkillsBrowserView';
import AboutView from './components/AboutView';
import skillsData from './data/skills/index.js';
import contentData from './content.yml';
import { getSkillTypeIcon, getSkillCategoryIcon, getSkillTypeLabel } from './utils/iconUtils.jsx';
import { organizeSkillsByType } from './utils/skillUtils.js';
import { formatDuration } from './utils/timeUtils.js';
import { usePracticeStepEvaluation } from './hooks/useStepEvaluation.js';
import { usePracticeTimer } from './hooks/useTimer.js';
import './App.css';
import './components.css';


// Main App Component
const RNSkillsApp = () => {
    const [currentView, setCurrentView] = React.useState('browser'); // 'browser' or 'about'
    const [skillsOrganization, setSkillsOrganization] = React.useState('number');
    const [lengthSortAscending, setLengthSortAscending] = React.useState(false);
    const [expandedSkill, setExpandedSkill] = React.useState(skillsData.skills.length === 1 ? skillsData.skills[0].id : null);

    // Individual skill practice mode hooks
    const [practiceMode, setPracticeMode] = React.useState(null);
    const { practiceTime, isPracticeRunning, practiceCompleted, startPractice, resetPractice, stopPractice,
            completePractice, setIsPracticeRunning } = usePracticeTimer();
    const { practiceStepEvaluations, handlePracticeStepEvaluation, getPracticeStepEvaluation,
            getPracticeMissedSteps, resetPracticeEvaluations } = usePracticeStepEvaluation();

    // Practice mode functions
    const startPracticeMode = (skillId) => {
        setPracticeMode(skillId);
        startPractice();
        resetPracticeEvaluations();
    };

    const resetPracticeMode = () => {
        resetPractice();
        resetPracticeEvaluations();

        setTimeout(() => {
            const skillElement = document.querySelector(`[data-skill-id="${practiceMode}"]`);
            if (skillElement) {
                skillElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest'
                });
            }
        }, 100);
    };

    const stopPracticeMode = () => {
        setPracticeMode(null);
        stopPractice();
        resetPracticeEvaluations();
    };

    const handlePracticeStepEvaluationWrapper = (skillId, stepIndex, evaluation) => {
        handlePracticeStepEvaluation(skillId, stepIndex, evaluation, () => {
            if (!isPracticeRunning && !practiceCompleted) {
                setIsPracticeRunning(true);
            }
        });
    };

    const hasPracticeCriticalFailures = (skill) => {
        if (!skill || !skill.steps) return false;
        return skill.steps.some((step, index) => {
            if (!step.critical) return false;
            const evaluation = getPracticeStepEvaluation(skill.id, index);
            return evaluation === 'miss';
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-3 sm:p-6">
            <div className="bg-white rounded-lg shadow-lg p-3 sm:p-6">
                {/* App Title */}
                <div className="mb-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{contentData.app.name}</h1>
                </div>

                {/* Navigation Tabs */}
                <div className="tab-container">
                    <button
                        onClick={() => setCurrentView('browser')}
                        className={`tab-button ${
                            currentView === 'browser' ? 'active' : 'inactive'
                        }`}
                    >
                        {contentData.navigation.skills}
                    </button>
                    {/* <button
                        onClick={() => setCurrentView('about')}
                        className={`tab-button ${
                            currentView === 'about' ? 'active' : 'inactive'
                        }`}
                    >
                        {contentData.navigation.about}
                    </button> */}
                </div>

                {/* View-specific Header Content */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                    <div>
                        <p className="text-gray-600 text-sm sm:text-base">
                            {currentView === 'browser'
                                ? contentData.app.taglines.browser
                                : contentData.app.taglines.about
                            }
                        </p>
                    </div>
                </div>

                {/* Skills Browser View */}
                {currentView === 'browser' && (
                    <SkillsBrowserView
                        skillsOrganization={skillsOrganization}
                        setSkillsOrganization={setSkillsOrganization}
                        lengthSortAscending={lengthSortAscending}
                        setLengthSortAscending={setLengthSortAscending}
                        expandedSkill={expandedSkill}
                        setExpandedSkill={setExpandedSkill}
                        getSkillTypeIcon={getSkillTypeIcon}
                        getSkillTypeLabel={getSkillTypeLabel}
                        getSkillCategoryIcon={getSkillCategoryIcon}
                        organizeSkillsByType={organizeSkillsByType}
                        contentData={contentData}
                        skillsData={skillsData}
                        practiceMode={practiceMode}
                        practiceTime={practiceTime}
                        isPracticeRunning={isPracticeRunning}
                        practiceCompleted={practiceCompleted}
                        practiceStepEvaluations={practiceStepEvaluations}
                        startPractice={startPracticeMode}
                        resetPractice={resetPracticeMode}
                        stopPractice={stopPracticeMode}
                        completePractice={completePractice}
                        handlePracticeStepEvaluation={handlePracticeStepEvaluationWrapper}
                        getPracticeStepEvaluation={getPracticeStepEvaluation}
                        getPracticeMissedSteps={getPracticeMissedSteps}
                        hasPracticeCriticalFailures={hasPracticeCriticalFailures}
                        formatDuration={formatDuration}
                        setIsPracticeRunning={setIsPracticeRunning}
                    />
                )}

                {/* About View */}
                {currentView === 'about' && (
                    <AboutView contentData={contentData} />
                )}
            </div>
        </div>
    );
};

const App = RNSkillsApp;
export default App;
