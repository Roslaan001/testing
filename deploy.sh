#!/bin/bash

# Variables
EC2_IP="3.89.106.39"
KEY_FILE="docker-app-key.pem"
EC2_USER="ec2-user"

echo "Copying application files to EC2 instance..."
scp -i $KEY_FILE -o StrictHostKeyChecking=no -r . $EC2_USER@$EC2_IP:~/js-app/

echo "Connecting to EC2 instance and setting up Docker..."
ssh -i $KEY_FILE -o StrictHostKeyChecking=no $EC2_USER@$EC2_IP << 'EOF'
# Install Docker
sudo yum update -y
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

echo "Docker installation completed!"
echo "Application files copied to ~/js-app/"
echo "You can now run the application using the instructions in the README.md"
EOF
