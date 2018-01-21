package com.danya.chat2018;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Version;

import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

@Data
@Entity
public class Message {

	private @Id @GeneratedValue Long id;
	private String username;
	private String text;
	private @CreatedDate LocalDateTime time;
	private @Version Long version;

	private Message() {}

	public Message(String username, String text) {
		this.username = username;
		this.text = text;
		//this.time = LocalDateTime.now();
	}
}