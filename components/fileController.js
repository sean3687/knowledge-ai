function ChatController({
	inputText,
	isLoading,
	messages,
	setIsSideBarOpen,
	setInputText,
	handleClick,
	handleRefresh,
}) {
	const handleInputChange = (event) => {
		setInputText(event.target.value);
	};

	const handleEnter = (event) => {
		if (event.key === "Enter") {
			handleClick();
		}
	};

	return (
		<div className="bg-[#fdfeff] relative flex w-full flex-1 overflow-hidden flex-col justify-between h-full shadow-2xl shadow-[#b3b6e6] z-20">
			<div className="flex justify-between items-center w-full p-4 bg-gradient-to-r from-[#542ee6] to-[#2a8ce6] font-bold ">
				<div className="hidden lg:block text-white">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={2}
						stroke="currentColor"
						className="w-8 h-8"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
						/>
					</svg>
				</div>
				<label
					htmlFor="my-drawer"
					className="btn drawer-button lg:hidden border-none bg-[#542ee6]"
					onClick={() => {
						setIsSideBarOpen(true);
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={2}
						stroke="currentColor"
						className="w-8 h-8"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
						/>
					</svg>
				</label>

				<button
					className="transition-all duration-300 text-white hover:text-pink-500"
					onClick={handleRefresh}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={2}
						stroke="currentColor"
						className="w-8 h-8"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
						/>
					</svg>
				</button>
			</div>

			{/* Conversation */}
			{messages.length == 0 ? (
				<div className="font-bold text-8xl text-[#cccfef8c] text-center">
					Chit Chat Rabbit
				</div>
			) : (
				<div className="flex flex-col justify-between h-full overflow-y-scroll pb-96">
					<div className="mt-5 px-5">
						{messages?.map((message, key) => {
							return message.sender == "me" ? (
								<div className="chat chat-end" key={key}>
									<div className="chat-image avatar">
										<div className="w-10 rounded-full">
											<img src="src/imgs/cat.png" />
										</div>
									</div>
									<div className="chat-header">
										Me
										<time className="ml-2 text-xs opacity-50">
											{message.time}
										</time>
									</div>
									<div className="chat-bubble chat-bubble-info">
										{message.message}
									</div>
								</div>
							) : message.sender == "bot-loading" && isLoading ? (
								<div className="chat chat-start" key={key}>
									<div className="chat-image avatar">
										<div className="w-10 rounded-full">
											<img src="src/imgs/rabbit.png" />
										</div>
									</div>
									<div className="chat-header">
										Chit Chat Rabbit
										<time className="ml-2 text-xs opacity-50">
											{message.time}
										</time>
									</div>
									<div className="chat-bubble items-center chat-bubble-primary">
										<div className="flex space-x-3">
											<div className="h-2 w-2 bg-green-100 rounded-full animate-bounce200"></div>
											<div className="h-2 w-2 bg-green-100 rounded-full animate-bounce400"></div>
											<div className="h-2 w-2 bg-green-100 rounded-full animate-bounce"></div>
										</div>
									</div>
								</div>
							) : (
								<div className="chat chat-start" key={key}>
									<div className="chat-image avatar">
										<div className="w-10 rounded-full">
											<img src="src/imgs/rabbit.png" />
										</div>
									</div>
									<div className="chat-header">
										Chit Chat Rabbit
										<time className="ml-2 text-xs opacity-50">
											{message.time}
										</time>
									</div>
									<div className="chat-bubble chat-bubble-primary">
										{message.message}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}

			<div className="bg-white p-4 bottom-0 flex flex-row justify-between h-18 mb-2">
				<div className="flex flex-grow px-4">
					<input
						type="text"
						className="border p-2 mr-2 w-full  rounded-xl"
						placeholder={
							isLoading
								? "Wait a second...."
								: "Type your message..."
						}
						value={inputText}
						onChange={handleInputChange}
						onKeyDown={handleEnter}
					/>
				</div>
				<div className="flex w-1/7 justify-center">
					<button
						className={
							"py-2 px-4 mr-4 rounded-3xl hover:bg-green-300 hover:text-white" +
							(isLoading
								? " opacity-40 bg--[#2a8ce6] text-white "
								: " opacity-80 bg-gradient-to-r from-[#542ee6] to-[#2a8ce6] text-white")
						}
						onClick={handleClick}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={2}
							stroke="currentColor"
							className="w-10 h-8"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
}

export default ChatController;
