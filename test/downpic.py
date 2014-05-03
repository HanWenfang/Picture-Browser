#!/usr/bin/env python
#-*-coding:utf-8-*-

import redis
import sys

def getpic(r, user):
	value = r.hget(user, 1)
	pic = open("./test.jpg", "wb+")
	pic.write(value)
	pic.close()

def main():
	redisip = "127.0.0.1"
	redisport = 6379
	redisdb = 0
	pool = redis.ConnectionPool(host=redisip, port=redisport, db=redisdb)
	r = redis.Redis(connection_pool=pool)
	
	getpic(r, "hanwenfang")

	r.connection_pool.disconnect()

if __name__ == '__main__':
	main()

