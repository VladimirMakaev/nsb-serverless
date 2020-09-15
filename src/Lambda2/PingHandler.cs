using System;
using System.Threading.Tasks;
using Messages;
using NServiceBus;

namespace Lambda2
{
    public class PingHandler : IHandleMessages<Ping>
    {
        public Task Handle(Ping message, IMessageHandlerContext context)
        {
            if (message.Counter > 10)
            {
                throw new Exception("Too large counter: " + message.Counter);
            }
            Console.WriteLine($"Ping {message.Counter}");
            return context.Send(new Pong {Counter = message.Counter + 1});
        }
    }
}