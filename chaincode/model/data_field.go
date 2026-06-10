package model

type DataField struct {
	Id               string `json:"id"`
	HashOfMessage    string `json:"hash_of_message,omitempty"`
	HashOfCiphertext string `json:"hash_of_ciphertext,omitempty"`
	Origin           string `json:"origin,omitempty"`
	Status           string `json:"status,omitempty"`
	AccessPolicy     string `json:"access_policy,omitempty"`
}
