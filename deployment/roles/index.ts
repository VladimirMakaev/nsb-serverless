import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import { PolicyDocument } from "@pulumi/aws/iam";


export function createRole() {
    const role = new aws.iam.Role("POC.NServiceBusServerless", {
        assumeRolePolicy: <PolicyDocument>{
            Version: "2012-10-17",
            Statement: [
                {
                    Action: "sts:AssumeRole",
                    Effect: "Allow",
                    Principal: {
                        Service: "lambda.amazonaws.com"
                    },
                }
            ]
        }
    })

    const sqsPolicy = new aws.iam.RolePolicy("POC.LambdaSqsPolicy", {
        role: role.id,
        policy: {
            Version: "2012-10-17",
            Statement: [
                {
                    Effect: "Allow",
                    Action: [
                        "sqs:SendMessage",
                        "sqs:ReceiveMessage"
                    ],
                    Resource: "arn:aws:sqs:*:*:*"
                }
            ]
        }
    })

    const logPolicy = new aws.iam.RolePolicy("POC.LambdaLogPolicy", {
        role: role.id,
        policy: <PolicyDocument>{
            Version: "2012-10-17",
            Statement: [{
                Effect: "Allow",
                Action: [
                    "logs:CreateLogGroup",
                    "logs:CreateLogStream",
                    "logs:PutLogEvents"
                ],
                Resource: "arn:aws:logs:*:*:*"
            }]
        }
    });

    return role;
}