import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "../../hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchUserMessages, getAnswerToChat } from "../../utils/utils";
import { useState } from "react";
import { Ellipsis } from "lucide-react";
import { SendHorizonal } from "lucide-react";
import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  businessType: z.string().min(1, "Select an option"),
  targetAudience: z.string().min(1, "Select an option"),
  salesChannels: z.string().min(1, "Select an option"),
  challenges: z.string().min(1, "Select an option"),
  tools: z.string().min(1, "Select an option"),
  solutions: z.string().min(1, "Select an option"),
});

const Chat = ({ userInfo }) => {
	const [messages, setMessages] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessType: "",
      targetAudience: "",
      salesChannels: "",
      challenges: "",
      tools: "",
      solutions: "",
    }
  });
	const { toast } = useToast();

	const { data: messagesFromDb, isLoading: messagesFromDbLoading } = useQuery({
    queryKey: ['messages', userInfo?.id],
    queryFn: async () => await fetchUserMessages(userInfo?.id),
  });

  const onSubmit = async (data) => {
    const userMessage = `I have a ${data.businessType} business focused on ${data.targetAudience} through ${data.salesChannels} channels. My main challenge is ${data.challenges} and I currently use ${data.tools}. I'm interested in implementing ${data.solutions} solutions to optimize my results.`;
    
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const result = await getAnswerToChat(userMessage, userInfo.id);
      const solutions = typeof result === 'string' ? JSON.parse(result) : result;
      setMessages(prev => [...prev, { role: 'assistant', content: solutions }]);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to get response from server: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

	if (messagesFromDbLoading) {
		return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-10 w-10" /></div>;
	}

	if (messagesFromDb) {
		return (
			<Card className="w-full max-w-5xl mx-auto mt-8">
					<CardContent className="p-6 space-y-4">
						<div  className="flex items-start gap-3">
							<Avatar>
								<AvatarImage 
									src="https://icons.veryicon.com/png/o/business/vscode-program-item-icon/robot-44.png"
									alt="AI" 
								/>
								<AvatarFallback>
									AI
								</AvatarFallback>
							</Avatar>
							<div className="flex flex-col gap-2 w-full">
								{messagesFromDb.map((message, index) => (
										<div className="flex-1 bg-muted p-4 rounded-lg bg-gray-100" key={index}>
											<h3 className="font-bold">{message.name}</h3>
											<p>{message.description}</p>
											{message.steps && (
												<ul className="list-disc pl-5 space-y-1">
													{message.steps.map((step, stepIdx) => (
														<li key={stepIdx}>{step}</li>
													))}
												</ul>
											)}
										</div>
								))}
							</div>
						</div>
					</CardContent>
				</Card>
		);
	}

  return (
    <div className="space-y-4">
			<Card className="w-full max-w-5xl mx-auto mt-8">
				<CardContent className="p-6">
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className="text-lg leading-relaxed flex flex-wrap items-center gap-2">
							<p>
								Your answers will help us better understand your
							</p>
							<p>
								<Select onValueChange={(value) => form.setValue('businessType', value)}>
									<SelectTrigger className="w-auto">
										<SelectValue placeholder="business type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Retail">Retail</SelectItem>
										<SelectItem value="Services">Services</SelectItem>
										<SelectItem value="Manufacturing">Manufacturing</SelectItem>
										<SelectItem value="Technology">Technology</SelectItem>
									</SelectContent>
								</Select>
							</p>
							<p>
								Our goal is to improve your sales by focusing on your
							</p>
							<p>
								<Select onValueChange={(value) => form.setValue('targetAudience', value)}>
									<SelectTrigger className="w-auto">
										<SelectValue placeholder="target audience" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="End Consumer (B2C)">End Consumer (B2C)</SelectItem>
										<SelectItem value="Businesses (B2B)">Businesses (B2B)</SelectItem>
										<SelectItem value="Both">Both</SelectItem>
									</SelectContent>
								</Select>
							</p>
							<p>
								through your
							</p>
							<p>
								<Select onValueChange={(value) => form.setValue('salesChannels', value)}>
									<SelectTrigger className="w-auto">
										<SelectValue placeholder="sales channels" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Physical Store">Physical Store</SelectItem>
										<SelectItem value="Online">Online</SelectItem>
										<SelectItem value="Hybrid">Hybrid</SelectItem>
									</SelectContent>
								</Select>
							</p>
							<p>
								We understand that one of your main challenges is
								</p>
							<p>
								<Select onValueChange={(value) => form.setValue('challenges', value)}>
									<SelectTrigger className="w-auto">
										<SelectValue placeholder="current challenges" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Customer Acquisition">Customer Acquisition</SelectItem>
										<SelectItem value="Customer Retention">Customer Retention</SelectItem>
										<SelectItem value="Operations">Operations</SelectItem>
										<SelectItem value="Competition">Competition</SelectItem>
									</SelectContent>
								</Select>
							</p>
							<p>
								, and you currently use
							</p>
							<p>
								<Select onValueChange={(value) => form.setValue('tools', value)}>
									<SelectTrigger className="w-auto">
										<SelectValue placeholder="tools" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="CRM">CRM</SelectItem>
										<SelectItem value="POS">POS</SelectItem>
										<SelectItem value="ERP">ERP</SelectItem>
										<SelectItem value="No tools">No tools</SelectItem>
									</SelectContent>
								</Select>
							</p>
							<p>
								. We can help you by implementing
							</p>
							<p>
								<Select onValueChange={(value) => form.setValue('solutions', value)}>
									<SelectTrigger className="w-auto">
										<SelectValue placeholder="solutions" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
										<SelectItem value="Automation">Automation</SelectItem>
										<SelectItem value="Data Analytics">Data Analytics</SelectItem>
										<SelectItem value="E-commerce">E-commerce</SelectItem>
									</SelectContent>
								</Select>
								</p>
								<p>
								solutions to optimize your results.
								</p>
						</div>
						<div className="mt-6 flex justify-end">
							<Button
								type="submit"
								disabled={isLoading || messages.length > 1}
							>
								<SendHorizonal className="h-4 w-4" />
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
			{messages.length > 0 && (
				<Card className="w-full max-w-5xl mx-auto">
					<CardContent className="p-6 space-y-4">
						{messages.map((message, index) => (
							<div key={index} className="flex items-start gap-3">
								<Avatar>
									<AvatarImage 
										src={message.role === 'user' ? "/user-avatar.png" : "https://icons.veryicon.com/png/o/business/vscode-program-item-icon/robot-44.png"}
										alt={message.role} 
									/>
									<AvatarFallback>
										{message.role === 'user' ? userInfo.name.charAt(0) : 'AI'}
									</AvatarFallback>
								</Avatar>
								<div className="flex-1 bg-muted p-4 rounded-lg bg-gray-100">
									{message.role === 'user' ? (
										<p >{message.content}</p>
									) : (
										<div className="space-y-6">
											{message.content && (
												message.content.map((solution, idx) => (
													<div key={idx} className="space-y-2">
														<h3 className="font-bold">{solution.name}</h3>
														<p>{solution.description}</p>
														{solution.steps && (
															<ul className="list-disc pl-5 space-y-1">
																{solution.steps.map((step, stepIdx) => (
																	<li key={stepIdx}>{step}</li>
																))}
															</ul>
														)}
													</div>
												))
											)}
										</div>
									)}
								</div>
							</div>
						))}
						{isLoading && (
							<div className="flex items-start gap-3">
								<Avatar>
									<AvatarImage src="https://icons.veryicon.com/png/o/business/vscode-program-item-icon/robot-44.png" alt="AI" />
									<AvatarFallback>AI</AvatarFallback>
								</Avatar>
								<div className="flex-1 bg-muted p-4 rounded-lg">
									<p className="text-sm"><Ellipsis className="animate-spin" /></p>
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			)}
		</div>
  );
};

export default Chat;
