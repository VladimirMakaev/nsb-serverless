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

const lambda1 = new aws.lambda.Function("lambda-1", {
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
    memorySize: 128
});


const lambda2 = new aws.lambda.Function("lambda-2", {
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
    memorySize: 128
});