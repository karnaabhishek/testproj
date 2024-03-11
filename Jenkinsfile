pipeline {
    agent { 
        node {
            label 'jenkins'
        }
    }
    environment {
        // Define your ECR repository URL and AWS credentials
        BE_ECR_REPOSITORY = '381492068250.dkr.ecr.ap-south-1.amazonaws.com/be'
        FE_ECR_REPOSITORY = '381492068250.dkr.ecr.ap-south-1.amazonaws.com/fe'
        AWS_ACCESS_KEY_ID = 'AKIAVRUVS76NDDBILVMU'
        AWS_SECRET_ACCESS_KEY = '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'
        AWS_DEFAULT_REGION = 'ap-south-1'
        WEB_IMAGE_TAG = "sfds-web-${env.BUILD_NUMBER}"
        FE_IMAGE_TAG = "sfds-fe-${env.BUILD_NUMBER}"
    }
    triggers {
        pollSCM '* * * * *'
    }
    stages {
        stage('Build') {
            steps {
                echo "Building.."
                script {
                    // Login to AWS ECR
                    sh "aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $BE_ECR_REPOSITORY"
                    // Build the Docker image with a tag
                    sh "docker build -t $BE_ECR_REPOSITORY:$WEB_IMAGE_TAG /home/ec2-user/workspace/aadhunik"
                    sh "aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $FE_ECR_REPOSITORY"
                    sh "docker build -t $FE_ECR_REPOSITORY:$FE_IMAGE_TAG -f /home/ec2-user/workspace/aadhunik/Dockerfile.FE /home/ec2-user/workspace/aadhunik"
                }
            }
        }
        stage('Deliver') {
            steps {
                echo 'Deliver....'
                script {
                    // Push the Docker image to ECR
                    sh "docker push $BE_ECR_REPOSITORY:$WEB_IMAGE_TAG"
                    sh "docker push $FE_ECR_REPOSITORY:$FE_IMAGE_TAG"
                }
            }
        }
        stage('Update Deployment') {
            steps {
                script {
                    sh "rm -r kubernetesmanifest"
                    sh "git clone git@github.com:karnaabhishek/kubernetesmanifest.git"
                    dir('kubernetesmanifest/manifest') {
                        
                        // Update deployment.yaml
                        sh """
                        sed -i 's|381492068250.dkr.ecr.ap-south-1.amazonaws.com/be:[^ ]*|381492068250.dkr.ecr.ap-south-1.amazonaws.com/be:${WEB_IMAGE_TAG}|g' deployment.yaml
                        sed -i 's|381492068250.dkr.ecr.ap-south-1.amazonaws.com/fe:[^ ]*|381492068250.dkr.ecr.ap-south-1.amazonaws.com/fe:${FE_IMAGE_TAG}|g' deployment.yaml
                        """

                        sh """
                        git add .
                        git commit -m "Update image tags to ${WEB_IMAGE_TAG} and ${FE_IMAGE_TAG}"
                        git push
                        """
                    }
                }
            }
        }
    }
    post {
        always {
            // Logout from ECR
            sh "docker logout $FE_ECR_REPOSITORY"
            sh "docker logout $BE_ECR_REPOSITORY"
        }
    }
}
