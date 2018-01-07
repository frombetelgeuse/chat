package com.danya.chat2018;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import lombok.Data;

@Data
@Entity
public class Message {

	private @Id @GeneratedValue Long id;
	private String username;
	private String text;

	private Message() {}

	public Message(String username, String text) {
		this.username = username;
		this.text = text;
	}
}