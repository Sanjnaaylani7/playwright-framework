pipeline {
    agent any

    options {
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '20'))
    }

    // Run on every GitHub push (needs the webhook, see README) AND nightly at ~2 AM
    triggers {
        githubPush()
        cron('H 2 * * *')
    }

    environment {
        IMAGE_NAME     = 'playwright-framework'
        CONTAINER_NAME = "pw-run-${env.BUILD_NUMBER}"
        BASE_URL       = 'https://www.saucedemo.com'
        API_BASE_URL   = 'https://jsonplaceholder.typicode.com'
    }

    stages {
        stage('Checkout') {
            steps {
                // Pulls the code from the GitHub repository configured in the Jenkins job
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} -t ${IMAGE_NAME}:latest .'
            }
        }

        stage('Run UI & API Tests in Docker') {
            steps {
                // The test exit code is stored so that the reports are ALWAYS copied out, even when tests fail.
                sh '''
                    rm -rf allure-results allure-report screenshots logs
                    set +e
                    docker run --name ${CONTAINER_NAME} --ipc=host \
                        -e BASE_URL=${BASE_URL} -e API_BASE_URL=${API_BASE_URL} \
                        ${IMAGE_NAME}:${BUILD_NUMBER}
                    echo $? > test-exit-code.txt
                    set -e
                    docker cp ${CONTAINER_NAME}:/app/allure-results ./allure-results || true
                    docker cp ${CONTAINER_NAME}:/app/allure-report  ./allure-report  || true
                    docker cp ${CONTAINER_NAME}:/app/screenshots    ./screenshots    || true
                    docker cp ${CONTAINER_NAME}:/app/logs           ./logs           || true
                '''
            }
        }

        stage('Publish Reports') {
            steps {
                // Allure Jenkins Plugin (Manage Jenkins > Plugins > "Allure")
                allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
                archiveArtifacts artifacts: 'screenshots/**, logs/**, allure-report/**', allowEmptyArchive: true, fingerprint: true
            }
        }

        stage('Verify Result') {
            steps {
                script {
                    def code = readFile('test-exit-code.txt').trim()
                    if (code != '0') {
                        error "Tests failed (exit code ${code}). Check the Allure report."
                    }
                }
            }
        }
    }

    post {
        always {
            sh 'docker rm -f ${CONTAINER_NAME} || true'
        }
        success { echo 'Pipeline finished: ALL TESTS PASSED' }
        failure { echo 'Pipeline finished: FAILURES - see Allure report / archived screenshots' }
    }
}
