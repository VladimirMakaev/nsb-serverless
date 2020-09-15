using System;
using System.Threading.Tasks;
using Messages;
using NServiceBus;

namespace Lambda1
{
    public class PongHandler : IHandleMessages<Pong>
    {
        public Task Handle(Pong message, IMessageHandlerContext context)
        {
            if (message.Counter > 10)
            {
                throw new Exception("Too large counter: " + message.Counter);
            }
            Console.WriteLine($"Pong {message.Counter}");
            return context.Send(new Ping {Counter = message.Counter + 1});
        }
    }
}