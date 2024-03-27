import MessageForm from "@/app/components/MessageForm";

const EditMessage = ({ params }: { params?: { id: string } }) => {
  return <MessageForm params={params} />;
};

export default EditMessage;
