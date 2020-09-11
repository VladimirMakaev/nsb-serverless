import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";


export function createQueue(name: string) {
    const queue = new aws.sqs.Queue(name, {
        name: name
    });

    return queue;
}