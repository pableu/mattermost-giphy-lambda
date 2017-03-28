# mattermost-giphy-lambda
AWS Lambda Function to create a Slash-Command for Giphy-Integration in Mattermost

## Description

This is pretty primitive AWS Lamba function to use with Mattermost for Giphy-Integration. It allows to create 
a slash-command such as "/giphy <keyword>" to post a random gif for that keyword from giphy into a channel or chat.

## Setup

### AWS Lambda

1. Create a new lambda function with the "Node.js 6.10" runtime. 
2. Copy-paste the content of index.js into it. 
3. Save

### AWS API Gateway

Add a new API Gateway POST endpoint. It should have "integration type" Lambda and point to your Lambda function from the previous step.

Mattermost submits its request using POST and as x-www-form-urlencoded, but Lambda expects JSON. 

Therefore, you need to edit the "Integration Request" and add the following Body Mapping Template for `application/x-www-form-urlencoded`:
    
    #set($allParams = $input.params())
    {
      "body" : $input.json('$')
    }
    
This should convert the x-www-form-urlencoded'ed data to JSON.
    
### Mattermost

https://docs.mattermost.com/developer/slash-commands.html

Add a slash command according to the documentation and point it at your API Gateway URL.
