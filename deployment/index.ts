import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import { PolicyDocument } from "@pulumi/aws/iam";

import { createRole } from "./roles"
import { createQueue } from './sqs'
import { FileArchive } from "@pulumi/pulumi/asset";
import { create } from "domain";

const role = createRole();

const queue1 = createQueue("Lambda1");
const queue2 = createQueue("Lambda2");
const errorQueue = createQueue("ErrorQueue");

const defaultSize = 256;

const lambda1 = new aws.lambda.Function("Lambda-1", {
    runtime: "dotnetcore3.1",
    code: new FileArchive("../src/Lambda1/bin/Release/netcoreapp3.1/Lambda1.zip"),
    role: role.arn,
    handler: "Lambda1::Lambda1.Function::FunctionHandler",
    timeout: 20,
    environment: {
        variables: {
            "Var1": "100"
        }
    },
    memorySize: defaultSize,
    name: "Lambda-1"
});


const lambda2 = new aws.lambda.Function("Lambda-2", {
    runtime: "dotnetcore3.1",
    code: new FileArchive("../src/Lambda2/bin/Release/netcoreapp3.1/Lambda2.zip"),
    role: role.arn,
    timeout: 20,
    handler: "Lambda2::Lambda2.Function::FunctionHandler",
    environment: {
        variables: {
            "Var1": "100"
        }
    },
    memorySize: 128,
    name: "Lambda-2"
});


const trigger1 = new aws.lambda.EventSourceMapping("trigger1", {
    eventSourceArn: queue1.arn,
    functionName: lambda1.arn,
    enabled: true,
}, { deleteBeforeReplace: true });


const trigger2 = new aws.lambda.EventSourceMapping("trigger2", {
    eventSourceArn: queue2.arn,
    functionName: lambda2.arn,
    enabled: true,
}, { deleteBeforeReplace: true });


const lambda3 = new aws.lambda.Function("Publisher", {
    runtime: "dotnetcore3.1",
    code: new FileArchive("../src/Publisher/bin/Release/netcoreapp3.1/Publisher.zip"),
    role: role.arn,
    timeout: 20,
    handler: "Publisher::Publisher.Function::FunctionHandler",
    environment: {
        variables: {
            "Var1": "100"
        }
    },
    memorySize: 128,
    name: "Publisher"
});
