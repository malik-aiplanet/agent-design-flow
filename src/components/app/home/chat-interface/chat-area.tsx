import MessageBubble from "@/components/app/message-bubble";

type Props = {
  messages: Conversation["messages"];
  title: string;
  description?: string;
};

export default function ChatArea({ messages, title, description }: Props) {
  const isEmpty = messages.length == 0;

  if (isEmpty) {
    return (
      <div className="flex flex-col gap-5 items-center overflow-y-auto px-4 pt-64 mb-12">
        <h2 className="font-semibold text-3xl ">{title}</h2>
        {typeof description !== "undefined" && (
          <p className="bg-teal-800/10 text-center p-4 rounded-2xl border border-[#2463EB]/15">
            {description}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 h-8/12 flex flex-col gap-3 overflow-y-auto px-4 pb-4">
      {messages.map(({ id, role, content }) => {
        const isUser = role === "user";

        return <MessageBubble key={id} content={content} role={role} />;
      })}
    </div>
  );
}
