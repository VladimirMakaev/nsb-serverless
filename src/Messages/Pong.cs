using NServiceBus;

namespace Messages
{
    public class Pong : IMessage
    {
        public int Counter { get; set; }
    }
}