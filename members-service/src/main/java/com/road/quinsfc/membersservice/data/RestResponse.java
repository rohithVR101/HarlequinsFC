package com.road.quinsfc.membersservice.data;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class RestResponse {
    boolean isSuccessful;
    String errorMessage;

    public RestResponse(boolean isSuccessful) {
        this.isSuccessful = isSuccessful;
    }

    public RestResponse(boolean isSuccessful, String errorMessage) {
        this.isSuccessful = isSuccessful;
        this.errorMessage = errorMessage;
    }
}
