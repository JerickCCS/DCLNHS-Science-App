<template>
    <div class="page-container">
        <!-- Header -->
        <header class="header">
            <button class="back-button" @click="goBack">
                ← Back
            </button>
            <h1 class="title">Test Statistics</h1>
        </header>

        <!-- Main Content -->
        <main class="main-content">
            <!-- Overall Stats -->
            <div class="stats-card">
                <div class="stats-header">
                    <h2>Overall Performance</h2>
                </div>
                <div class="stats-grid">
                    <div class="stat-box">
                        <div class="stat-number">{{ overallAverage }}%</div>
                        <div class="stat-label">Average Score</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-number">{{ completedTests }}/12</div>
                        <div class="stat-label">Tests Completed</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-number">{{ totalCorrect }}/{{ totalQuestions }}</div>
                        <div class="stat-label">Total Correct</div>
                    </div>
                </div>
            </div>

            <!-- Chapter Results -->
            <div class="stats-card">
                <div class="stats-header">
                    <h2>Chapter Results</h2>
                </div>
                <div class="chapter-list">
                    <div v-for="chapter in chapterResults" :key="chapter.number" class="chapter-item"
                        :class="{ 'completed': chapter.completed }" @click="viewChapterTest(chapter.number)">
                        <div class="chapter-info">
                            <div class="chapter-title">
                                <span class="chapter-number">Chapter {{ chapter.number }}</span>
                                <span class="status-badge" :class="getStatusClass(chapter)">
                                    {{ chapter.completed ? 'Completed' : 'Not Started' }}
                                </span>
                            </div>
                            <div class="chapter-stats">
                                <span class="chapter-score">{{ chapter.score || 0 }}/{{ chapter.total || '?' }}</span>
                                <span class="chapter-percentage">{{ chapter.percentage || 0 }}%</span>
                            </div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" :class="getProgressClass(chapter.percentage)"
                                :style="{ width: `${chapter.percentage || 0}%` }"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
                <button class="btn btn-primary" @click="continueNextTest" :disabled="nextChapterIndex > 12">
                    Continue Next Test
                </button>
                <button class="btn btn-secondary" @click="retryWeakestChapter" :disabled="!worstChapter">
                    Retry Weakest Chapter
                </button>
            </div>
        </main>
    </div>
</template>

<script>
import { LocalStorage } from "quasar";
import { getCurrentUser } from "src/utils/session.js";

export default {
    data() {
        return {
            user: null,
            chapterResults: []
        };
    },

    computed: {
        completedTests() {
            return this.chapterResults.filter(chapter => chapter.completed).length;
        },

        overallAverage() {
            const completed = this.chapterResults.filter(chapter => chapter.completed);
            if (completed.length === 0) return 0;
            const sum = completed.reduce((total, chapter) => total + chapter.percentage, 0);
            return Math.round(sum / completed.length);
        },

        totalCorrect() {
            return this.chapterResults.reduce((total, chapter) => total + (chapter.score || 0), 0);
        },

        totalQuestions() {
            return this.chapterResults.reduce((total, chapter) => total + (chapter.total || 0), 0);
        },

        worstChapter() {
            const completed = this.chapterResults.filter(chapter => chapter.completed);
            if (completed.length === 0) return null;
            return completed.reduce((worst, current) =>
                current.percentage < worst.percentage ? current : worst
            );
        },

        nextChapterIndex() {
            const incomplete = this.chapterResults.find(chapter => !chapter.completed);
            return incomplete ? incomplete.number : 13; // Return 13 if all completed
        }
    },

    mounted() {
        this.loadUserData();
    },

    methods: {
        loadUserData() {
            this.user = getCurrentUser();
            if (!this.user) {
                this.user = LocalStorage.getItem("currentUser");
            }

            if (this.user) {
                this.initializeChapterResults();
            }
        },

        initializeChapterResults() {
            // Initialize all 12 chapters with placeholder data
            this.chapterResults = Array.from({ length: 12 }, (_, i) => {
                const chapterNumber = i + 1;
                const testData = this.user.chapterTest?.[chapterNumber];

                if (testData) {
                    return {
                        number: chapterNumber,
                        score: testData.score || testData.correct || 0,
                        total: testData.total || 0, // Will vary per chapter
                        percentage: testData.percentage || 0,
                        completed: testData.completed || false,
                        timestamp: testData.timestamp,
                        chapterID: testData.chapterID
                    };
                } else {
                    // Default values for uncompleted tests
                    return {
                        number: chapterNumber,
                        score: 0,
                        total: 0, // Will be set when test is taken
                        percentage: 0,
                        completed: false,
                        timestamp: null,
                        chapterID: `chapter_${chapterNumber}`
                    };
                }
            });
        },

        getStatusClass(chapter) {
            if (!chapter.completed) return 'status-not-started';
            if (chapter.percentage >= 80) return 'status-excellent';
            if (chapter.percentage >= 60) return 'status-good';
            return 'status-needs-improvement';
        },

        getProgressClass(percentage) {
            if (percentage >= 80) return 'progress-excellent';
            if (percentage >= 60) return 'progress-good';
            if (percentage >= 40) return 'progress-average';
            return 'progress-poor';
        },

        viewChapterTest(chapterNumber) {
            // Navigate to chapter test
            this.$router.push(`/chapter-test/${chapterNumber}`);
        },

        retryWeakestChapter() {
            if (this.worstChapter) {
                this.viewChapterTest(this.worstChapter.number);
            }
        },

        continueNextTest() {
            if (this.nextChapterIndex <= 12) {
                this.viewChapterTest(this.nextChapterIndex);
            }
        },

        goBack() {
            window.history.back();
        }
    }
};
</script>

<style scoped>
.page-container {
    min-height: 100vh;
    background: #f5f5f5;
    padding: 16px;
}

.header {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e0e0e0;
}

.back-button {
    background: none;
    border: none;
    color: #666;
    font-size: 16px;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 6px;
    margin-right: 16px;
}

.back-button:hover {
    background: #e0e0e0;
}

.title {
    font-size: 24px;
    font-weight: 600;
    color: #333;
    margin: 0;
}

.main-content {
    max-width: 800px;
    margin: 0 auto;
}

.stats-card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stats-header {
    margin-bottom: 20px;
}

.stats-header h2 {
    font-size: 18px;
    color: #333;
    margin: 0;
    font-weight: 600;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
}

.stat-box {
    text-align: center;
    padding: 16px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
}

.stat-number {
    font-size: 24px;
    font-weight: 700;
    color: #333;
    margin-bottom: 4px;
}

.stat-label {
    font-size: 14px;
    color: #666;
}

.chapter-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.chapter-item {
    padding: 16px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
}

.chapter-item:hover {
    background: #f9f9f9;
    border-color: #007bff;
}

.chapter-item.completed {
    background: #f8f9fa;
}

.chapter-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.chapter-title {
    display: flex;
    align-items: center;
    gap: 12px;
}

.chapter-number {
    font-size: 16px;
    font-weight: 600;
    color: #333;
}

.status-badge {
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 12px;
    font-weight: 500;
}

.status-not-started {
    background: #e0e0e0;
    color: #666;
}

.status-excellent {
    background: #d4edda;
    color: #155724;
}

.status-good {
    background: #fff3cd;
    color: #856404;
}

.status-needs-improvement {
    background: #f8d7da;
    color: #721c24;
}

.chapter-stats {
    display: flex;
    gap: 16px;
    align-items: center;
}

.chapter-score {
    font-size: 14px;
    color: #666;
}

.chapter-percentage {
    font-size: 18px;
    font-weight: 700;
    color: #333;
}

.progress-bar {
    height: 8px;
    background: #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    transition: width 0.3s ease;
}

.progress-excellent {
    background: #28a745;
}

.progress-good {
    background: #ffc107;
}

.progress-average {
    background: #fd7e14;
}

.progress-poor {
    background: #dc3545;
}

.action-buttons {
    display: flex;
    gap: 12px;
    margin-top: 24px;
}

.btn {
    flex: 1;
    padding: 14px 20px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-primary {
    background: #007bff;
    color: white;
}

.btn-primary:hover:not(:disabled) {
    background: #0056b3;
}

.btn-secondary {
    background: #6c757d;
    color: white;
}

.btn-secondary:hover:not(:disabled) {
    background: #545b62;
}

/* Responsive */
@media (max-width: 768px) {
    .stats-grid {
        grid-template-columns: 1fr;
        gap: 12px;
    }

    .chapter-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }

    .chapter-stats {
        width: 100%;
        justify-content: space-between;
    }

    .action-buttons {
        flex-direction: column;
    }
}
</style>