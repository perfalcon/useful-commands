# GitHub Action for SCOM's Validate-Build-Package-Deploy

- This is a Composite GitHub Action.
- This Action validates, builds, creates downloadable package and deploys to tomcat server.



### Usage
```
on: 
  push:
    branches: [ "Branch-Name" ]
  pull_request:
    branches: [ ""Branch-Name" ]

jobs:
  Validate-Build-Deploy:
    runs-on: ubuntu-latest
    name: Validate Build Deploy
    steps:
      - uses: actions/checkout@v4    
      - id: myId  
        uses: abcOfAmerica/scom-github-action@main
        with:
          _jfrog_username: ${{secrets._JFROG_USERNAME}}
          _jfrog_password: ${{secrets._JFROG_PASSWORD}}
          tomcat_username: ${{secrets.TOMCAT_USER}}
          tomcat_password: ${{secrets.TOMCAT_PASSWORD}}
          lifecycle: 3
```

### Prerequisite
- Setup Secrets
- Update the pom.xml with the Tomcat plugin for deploying to tomcat

### Life Cycle of the Action
1. Validate the Versions
2. Build with Test Cases 
3. Build and Package [skip Test Cases]
4. Upload Package
5. Deploy to Tomcat with Maven


### Detailed Steps
- Checkout the code from Main Branch
- Get the Version from pom for Main Branch
- Checkout the code from current Branch
- Get the Version from pom for Current Branch
- Validate the Versions from Main & Current Branch
- StopOrContinue based out of result from Validate Version
- Set up JDK 1.8
- Build the project with Test Cases for Current Branch
- Build and Create package with Maven for Current Branch
- Upload Package to downloadable
- Deploy to Tomcat with Maven Plugin

### Setup Secrets
[GitHub Secrets ](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions) are encrypted and allow you to store sensitive information, such as access tokens, in your repository.

### Creating Secrets
Follow this link to create the link [GitHub Secrets ](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions) to create the secrets
Create the following secrets in your repository
1. _JFROG_USERNAME for JFrog User Name
2. _JFROG_PASSWORD for JFrog Password
3. TOMCAT_USER for Tomcat User name
4. TOMCAT_PASSWORD for Tomcat Password

### Add the Tomcat Plugin to pom.xml
Update the repository's pom.xml to add the Tomcat's Maven plugin to deploy the generated package to Tomcat Servers as follows:
```
  <plugin>
    <groupId>org.apache.tomcat.maven</groupId>
    <artifactId>tomcat7-maven-plugin</artifactId>
    <version>2.2</version>
    <configuration>
      <url>https://util.qa.abc.com/manager/text</url>
      <server>LinuxTomcatServer</server>
      <path>/ROOT_MVN</path>
    </configuration>
  </plugin>

```
- **url** refers to the Tomcat API where your application is deployed to.
- **server** refers to the Tomcat Credentials configured in the maven settings under the name '[LinuxTomcatServer](https://github.com/abcOfAmerica/scom-github-action/blob/main/config/maven_settings.xml)' 
- **path** refers to the context (or with what name the deployed package is copied on to Tomcat container)
