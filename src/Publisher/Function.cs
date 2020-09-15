using System;
using System.Threading.Tasks;
using Amazon.Lambda.Core;
using Amazon.Lambda.Serialization.SystemTextJson;
using Messages;
using NServiceBus;

[assembly: LambdaSerializer(typeof(DefaultLambdaJsonSerializer))]

namespace Publisher
{
    public class Function
    {
        private static readonly Lazy<Task<IEndpointInstance>> Endpoint = new Lazy<Task<IEndpointInstance>>(() =>
        {
            var c = new EndpointConfiguration("Sender");
            c.SendOnly();
            c.UseSerialization<NewtonsoftSerializer>();
            var t = c.UseTransport<SqsTransport>();
            t.Routing().RouteToEndpoint(typeof(Ping), "Lambda2");
            t.Routing().RouteToEndpoint(typeof(Pong), "Lambda1");
            return NServiceBus.Endpoint.Start(c);
        });

        public async Task FunctionHandler(object evnt, ILambdaContext context)
        {
            var e = await Endpoint.Value;
            await e.Send(new Ping {Counter = 0});
        }
    }
}