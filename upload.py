#!/usr/bin/env python
#-*-coding:utf-8-*-

import redis
import Image
import StringIO
import sys

def writetoredis(r, user, value):
	if not r.keys(user):
		r.hset(user, '1', value)
	else:
		keys =r.hlen(user)
		r.hset(user, keys+1, value)

def main():

	if len(sys.argv) != 3:
		print "wrong argument"
		return -1

	user = sys.argv[1]
	pic_path = sys.argv[2]

	
	output = StringIO.StringIO()
	im = Image.open(pic_path)
	im.save(output, format = im.format)
	value = output.getvalue()
	

	redisip = "127.0.0.1"
	redisport = 6379
	redisdb = 0
	pool = redis.ConnectionPool(host=redisip, port=redisport, db=redisdb)
	r = redis.Redis(connection_pool=pool)
	
	writetoredis(r, user, value)

	r.connection_pool.disconnect()
	output.close()

if __name__ == '__main__':
	main()

