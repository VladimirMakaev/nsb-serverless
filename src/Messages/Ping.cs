using NServiceBus;

namespace Messages
{
    public class Ping : IMessage
    {
        public int Counter { get; set; }
    }
}