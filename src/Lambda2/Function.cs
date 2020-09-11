using System;
using System.Threading;
using System.Threading.Tasks;
using Amazon.Lambda.Core;
using Amazon.Lambda.Serialization.SystemTextJson;
using Amazon.Lambda.SQSEvents;
using Messages;
using NServiceBus;

[assembly: LambdaSerializer(typeof(DefaultLambdaJsonSerializer))]

namespace Lambda2
{
    // Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
    public class Function
    {
        private static readonly TimeSpan DefaultRemainingTimeGracePeriod = TimeSpan.FromSeconds(1);

        private static readonly AwsLambdaSQSEndpoint Endpoint = new AwsLambdaSQSEndpoint(context =>
        {
            var endpointConfiguration = new AwsLambdaSQSEndpointConfiguration("Lambda2");
            endpointConfiguration.UseSerialization<NewtonsoftSerializer>();

            var transport = endpointConfiguration.Transport;
            var routing = transport.Routing();
            routing.RouteToEndpoint(typeof(Pong), "Lambda1");

            var advanced = endpointConfiguration.AdvancedConfiguration;
            advanced.SendFailedMessagesTo("ErrorQueue");
            // shows how to write diagnostics to file
            advanced.CustomDiagnosticsWriter(diagnostics =>
            {
                context.Logger.LogLine(diagnostics);
                return Task.CompletedTask;
            });

            return endpointConfiguration;
        });


        public async Task FunctionHandler(SQSEvent evnt, ILambdaContext context)
        {
            using (var cancellationTokenSource =
                new CancellationTokenSource(context.RemainingTime.Subtract(DefaultRemainingTimeGracePeriod)))
            {
                await Endpoint.Process(evnt, context, cancellationTokenSource.Token);
            }
        }
    }
}