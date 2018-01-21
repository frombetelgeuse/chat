package com.danya.chat2018;

import org.springframework.stereotype.Component;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.hateoas.EntityLinks;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.HandleAfterCreate;
import org.springframework.data.rest.core.annotation.HandleAfterDelete;
import org.springframework.data.rest.core.annotation.HandleAfterSave;
import static com.danya.chat2018.WebSocketConfiguration.MESSAGE_PREFIX;

@Component
@RepositoryEventHandler(Message.class)
public class MessageEventHandler {

	private final SimpMessagingTemplate websocket;

	private final EntityLinks entityLinks;

	@Autowired
	public MessageEventHandler(SimpMessagingTemplate websocket, EntityLinks entityLinks) {
		this.websocket = websocket;
		this.entityLinks = entityLinks;
	}

	@HandleAfterCreate
	public void newMessage(Message message) {
		this.websocket.convertAndSend(
				MESSAGE_PREFIX + "/newMessage", getPath(message));
	}

	/*@HandleAfterDelete
	public void deleteMessage(Message message) {
		this.websocket.convertAndSend(
				MESSAGE_PREFIX + "/deleteMessage", getPath(message));
	}

	@HandleAfterSave
	public void updateMessage(Message message) {
		this.websocket.convertAndSend(
				MESSAGE_PREFIX + "/updateMessage", getPath(message));
	}*/

	private String getPath(Message message) {
		return this.entityLinks.linkForSingleResource(message.getClass(),
				message.getId()).toUri().getPath();
	}

}